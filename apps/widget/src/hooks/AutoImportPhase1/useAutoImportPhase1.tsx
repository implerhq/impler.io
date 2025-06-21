import { useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useCallback, useMemo, useRef } from 'react';

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

  const sessionIdRef = useRef<string | null>(null);

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
    leaveSession(data.sessionId);
    // The mutation's onSuccess will handle navigation
  }, []);

  const handleError = useCallback((data: IErrorData) => {
    console.error('❌ RSS XML Processing error:', data);
    notifier.showError({
      message: data.error || 'Processing failed',
      title: 'RSS XML Error',
    });
  }, []);

  const handleConnectionChange = useCallback((connected: boolean) => {
    console.log('🔌 WebSocket connection status:', connected);
    if (!connected) {
      notifier.showError({
        message: 'Connection lost. Please try again.',
        title: 'Connection Error',
      });
    }
  }, []);

  // Initialize WebSocket connection
  const { isConnected, progressData, completionData, errorData, joinSession, socket, leaveSession, clearProgress } =
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
      setJobsInfo(data);

      // Leave the session when done
      if (sessionIdRef.current) {
        leaveSession(sessionIdRef.current);
        sessionIdRef.current = null;
      }

      // Clear progress data
      clearProgress();

      // Navigate to next step
      goNext();
    },
    onError(error) {
      console.error('❌ API Error:', error);
      notifier.showError({ message: error.message, title: error.error });

      // Leave the session on error
      if (sessionIdRef.current) {
        leaveSession(sessionIdRef.current);
        sessionIdRef.current = null;
      }

      // Clear progress data
      clearProgress();
    },
  });

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    (data) => {
      if (!isConnected) {
        notifier.showError({
          message: 'WebSocket not connected. Please wait and try again.',
          title: 'Connection Error',
        });

        return;
      }

      // Generate unique session ID
      const webSocketSessionId = generateSessionId();
      console.log(webSocketSessionId);
      sessionIdRef.current = webSocketSessionId;

      console.log('🚀 Starting RSS XML processing with session:', webSocketSessionId);

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

  // Format progress percentage for display
  const progressPercentage = useMemo(() => {
    if (progressData?.percentage !== undefined) {
      return Math.round(progressData.percentage);
    }

    return 0;
  }, [progressData?.percentage]);

  // Format progress message for display
  const progressMessage = useMemo(() => {
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
  }, [progressData, isGetRssXmlHeadingsLoading]);

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
    sessionIdRef,

    // Progress data
    progressData,
    progressPercentage,
    progressMessage,
    progressDetails,

    // Error and completion states
    errorData,
    completionData,
  };
}
