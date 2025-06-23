/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { generateSessionId, notifier } from '@util';
import { IAutoImportValues } from '@types';
import { useAppState } from '@store/app.context';
import { useAPIState } from '@store/api.context';
import { useJobsInfo } from '@store/jobinfo.context';
import { useImplerState } from '@store/impler.context';
import { IUserJob, IErrorObject } from '@impler/shared';
import {
  useWebSocketProgress,
  IProgressData,
  ICompletionData,
  IErrorData,
} from '@hooks/AutoImportPhase1/useWebSocketProgress';

interface IUseAutoImportPhase1Props {
  goNext: () => void;
}

interface FormValues {
  rssUrl: string;
}

export function useAutoImportPhase1({ goNext }: IUseAutoImportPhase1Props) {
  const { api } = useAPIState();
  const { setJobsInfo } = useJobsInfo();
  const { output, schema } = useAppState();
  const { templateId, extra, authHeaderValue } = useImplerState();

  const webSocketSessionIdRef = useRef<string | null>(null);
  const isAbortedRef = useRef<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  // WebSocket progress handlers
  const handleProgress = useCallback((data: IProgressData) => {
    console.log('📊 RSS XML Progress:', data);
    // You can add additional progress handling here if needed
  }, []);

  const handleCompletion = useCallback((data: ICompletionData) => {
    console.log('✅ RSS XML Processing completed:', data);

    if (webSocketSessionIdRef.current) {
      leaveSession(webSocketSessionIdRef.current);
      webSocketSessionIdRef.current = null;
    }
    // The mutation's onSuccess will handle navigation
  }, []);

  const handleError = useCallback((data: IErrorData) => {
    console.error('❌ RSS XML Processing error:', data);

    // Don't show error if operation was aborted by user
    if (!isAbortedRef.current) {
      notifier.showError({
        message: data.error || 'Processing failed',
        title: 'RSS XML Error',
      });
    }
  }, []);

  const handleConnectionChange = useCallback((connected: boolean) => {
    console.log('🔌 WebSocket connection status:', connected);
    if (!connected && !isAbortedRef.current) {
      notifier.showError({
        message: 'Connection lost. Please try again.',
        title: 'Connection Error',
      });
    }
  }, []);

  // Initialize WebSocket connection
  const { isConnected, progressData, completionData, errorData, joinSession, leaveSession, socket, clearProgress } =
    useWebSocketProgress({
      onProgress: handleProgress,
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
      console.log('✅ API Success:', data);

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
      console.error('❌ API Error:', error);

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
    console.log('🚫 Aborting RSS XML processing...');

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

      console.log('🚀 Started RSS XML processing with session:', webSocketSessionId);
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

  // Format progress message for display
  const progressMessage = useMemo(() => {
    if (isAbortedRef.current) {
      return 'Cancelling operation...';
    }

    if (progressData?.message) {
      return progressData.message;
    }
    if (progressData?.stage) {
      const stageMessages = {
        fetching: 'Fetching RSS feed...',
        parsing: 'Parsing XML data...',
        extracting: 'Extracting information...',
        mapping: 'Processing mappings...',
        completed: 'Processing completed!',
        error: 'An error occurred',
      };

      return stageMessages[progressData.stage] || 'Processing...';
    }
    if (isGetRssXmlHeadingsLoading) {
      return 'Starting RSS XML processing...';
    }

    return '';
  }, [progressData, isGetRssXmlHeadingsLoading, isAbortedRef.current]);

  // Format additional progress details
  const progressDetails = useMemo(() => {
    if (!progressData) return null;

    return {
      processedBytes: progressData.processedBytes,
      totalBytes: progressData.totalBytes,
      elementsProcessed: progressData.elementsProcessed,
      speedMBps: progressData.speedMBps,
      eta: progressData.eta,
      stage: progressData.stage,
    };
  }, [progressData]);

  const handleCleanup = useCallback(() => {
    // First abort the session if it's running
    if (canAbort && webSocketSessionIdRef.current) {
      abortOperation();
    }

    // Then do additional cleanup
    if (socket && socket.connected) {
      socket.disconnect();
    }
    if (webSocketSessionIdRef.current) {
      leaveSession(webSocketSessionIdRef.current);
      webSocketSessionIdRef.current = null;
    }
  }, [socket, webSocketSessionIdRef, leaveSession, abortOperation, canAbort]);

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
    socket,
    leaveSession,
    webSocketSessionIdRef,

    // Progress data
    progressData,
    progressPercentage,
    progressMessage,
    progressDetails,

    // Error and completion states
    errorData,
    completionData,

    // Abort functionality
    abortOperation,
    canAbort,
    handleCleanup,
    isAborted: isAbortedRef.current,
  };
}
