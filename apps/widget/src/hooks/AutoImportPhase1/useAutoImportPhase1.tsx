import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { generateSessionId, notifier } from '@util';
import { IAutoImportValues, IErrorData } from '@types';
import { useAppState } from '@store/app.context';
import { useAPIState } from '@store/api.context';
import { useJobsInfo } from '@store/jobinfo.context';
import { useImplerState } from '@store/impler.context';
import { IUserJob, IErrorObject } from '@impler/shared';
import { useWebSocketProgress } from '@hooks/AutoImportPhase1/useWebSocketProgress';

interface IUseAutoImportPhase1Props {
  goNext: () => void;
  onRegisterAbortFunction?: (abortFn: () => void) => void;
  onRegisterDisconnectFunction?: (disconnectFn: () => void) => void;
  onRssParsingStart?: () => void;
  onRssParsingEnd?: () => void;
}

interface FormValues {
  rssUrl: string;
}

export function useAutoImportPhase1({
  goNext,
  onRegisterAbortFunction,
  onRegisterDisconnectFunction,
  onRssParsingStart,
  onRssParsingEnd,
}: IUseAutoImportPhase1Props) {
  const { api } = useAPIState();
  const { setJobsInfo } = useJobsInfo();
  const { output, schema, texts } = useAppState();
  const { templateId, extra, authHeaderValue } = useImplerState();

  const webSocketSessionIdRef = useRef<string | null>(null);
  const isAbortedRef = useRef<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const handleCompletion = useCallback(() => {
    if (webSocketSessionIdRef.current) {
      leaveSession(webSocketSessionIdRef.current);
      webSocketSessionIdRef.current = null;
    }
    // The mutation's onSuccess will handle navigation
  }, []);

  const handleError = useCallback((data: IErrorData) => {
    // Don't show error if operation was aborted by user
    if (!isAbortedRef.current) {
      notifier.showError({
        message: data.error || 'Processing failed',
        title: 'RSS XML Error',
      });
    }
  }, []);

  const handleConnectionChange = useCallback((connected: boolean) => {
    if (!connected && !isAbortedRef.current) {
      notifier.showError({
        message: 'Connection lost. Please try again.',
        title: 'Connection Error',
      });
    }
  }, []);

  // Initialize WebSocket connection
  const {
    isConnected,
    progressData,
    completionData,
    errorData,
    joinSession,
    leaveSession,
    socket,
    disconnect,
    clearProgress,
  } = useWebSocketProgress({
    onCompletion: handleCompletion,
    onError: handleError,
    onConnectionChange: handleConnectionChange,
    autoConnect: true,
  });

  // Mutation for RSS XML processing
  const { isLoading: isGetRssXmlHeadingsLoading, mutate: getRssXmlHeading } = useMutation<
    IUserJob,
    IErrorObject,
    IAutoImportValues,
    [string]
  >(['getRssXmlHeading'], (importData) => api.getRssXmlMappingHeading(importData) as Promise<IUserJob>, {
    onSuccess(data) {
      // Only proceed if not aborted
      if (!isAbortedRef.current) {
        setJobsInfo(data);
        goNext();
      }

      // Clean up session
      if (webSocketSessionIdRef.current) {
        leaveSession(webSocketSessionIdRef.current);
        webSocketSessionIdRef.current = null;
      }
      clearProgress();
      isAbortedRef.current = false;
    },
    onError(error) {
      // Only show error if not aborted by user
      if (!isAbortedRef.current) {
        notifier.showError({ message: error.message, title: error.error });
      }

      // Clean up session
      if (webSocketSessionIdRef.current) {
        leaveSession(webSocketSessionIdRef.current);
        webSocketSessionIdRef.current = null;
      }
      clearProgress();
      isAbortedRef.current = false;
    },
  });

  // Abort current operation
  const abortOperation = useCallback(() => {
    if (webSocketSessionIdRef.current && socket?.connected) {
      isAbortedRef.current = true;

      // Send abort signal to backend
      socket.emit('abort-session', { sessionId: webSocketSessionIdRef.current });

      // Leave the session
      leaveSession(webSocketSessionIdRef.current);
      webSocketSessionIdRef.current = null;

      // Clear progress data
      clearProgress();

      // Show cancellation message
      notifier.showError({
        message: 'RSS XML processing has been cancelled.',
        title: 'Operation Cancelled',
      });
    }
  }, [socket, leaveSession, clearProgress]);

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    (data) => {
      if (!isConnected) {
        notifier.showError({
          message: 'WebSocket not connected. Please wait and try again.',
          title: 'Connection Error',
        });

        return;
      }

      // Reset abort flag
      isAbortedRef.current = false;

      // Generate unique session ID
      const webSocketSessionId = generateSessionId();
      webSocketSessionIdRef.current = webSocketSessionId;

      // Join WebSocket session
      joinSession(webSocketSessionId);

      // Clear any previous progress data
      clearProgress();

      // Start the RSS XML processing
      getRssXmlHeading({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        templateId: templateId!,
        webSocketSessionId,
        url: data.rssUrl,
        authHeaderValue,
        extra,
        output,
        schema,
      });
    },
    [isConnected, templateId, authHeaderValue, extra, output, schema, joinSession, clearProgress, getRssXmlHeading]
  );

  // Compute loading state - true if API is loading OR if we have progress data
  const isLoading = useMemo(() => {
    return isGetRssXmlHeadingsLoading || (progressData !== null && progressData.stage !== 'completed');
  }, [isGetRssXmlHeadingsLoading, progressData]);

  // Check if operation can be aborted
  const canAbort = useMemo(() => {
    return isLoading && webSocketSessionIdRef.current !== null && !isAbortedRef.current;
  }, [isLoading]);

  // Format progress percentage for display
  const progressPercentage = useMemo(() => {
    if (progressData?.percentage !== undefined) {
      return Math.round(progressData.percentage);
    }

    return 0;
  }, [progressData?.percentage]);

  useEffect(() => {
    if (canAbort && abortOperation && onRegisterAbortFunction) {
      onRegisterAbortFunction(abortOperation);
    }
  }, [canAbort, abortOperation, onRegisterAbortFunction]);

  // Register the disconnect function with the parent component
  useEffect(() => {
    if (isGetRssXmlHeadingsLoading) {
      onRssParsingStart?.();
    } else {
      onRssParsingEnd?.();
    }

    if (disconnect && onRegisterDisconnectFunction) {
      onRegisterDisconnectFunction(disconnect);
    }
  }, [isGetRssXmlHeadingsLoading, onRssParsingStart, onRssParsingEnd, disconnect, onRegisterDisconnectFunction]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (canAbort && webSocketSessionIdRef.current) {
        abortOperation();
      }
    };
  }, []);

  return {
    errors,
    register,
    onSubmit: handleSubmit(onSubmit),

    // Loading states
    isGetRssXmlHeadingsLoading: isLoading,
    isProcessing: isLoading,

    // WebSocket connection state
    isConnected,
    disconnect,
    socket,
    leaveSession,
    webSocketSessionIdRef,

    // Progress data
    progressData,
    progressPercentage,

    // Error and completion states
    errorData,
    completionData,

    // Abort functionality
    abortOperation,
    canAbort,
    isAborted: isAbortedRef.current,

    texts,
  };
}
