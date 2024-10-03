import { useCallback, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { IRecord } from '@impler/shared';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';

interface UpdateRecord {
  index: number;
  record: any;
  updated: any;
}

type UpdateQueue = Record<number, UpdateRecord>;

interface UseBatchedUpdateRecordProps {
  delay?: number;
  batchSize?: number;
  onUpdate?: () => void;
}

export function useBatchedUpdateRecord({ batchSize = 125, delay = 100, onUpdate }: UseBatchedUpdateRecordProps) {
  const { api } = useAPIState();
  const { uploadInfo } = useAppState();
  const updateQueueRef = useRef<UpdateQueue>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef<boolean>(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: updateRecordBatch } = useMutation<IRecord[], Error, UpdateRecord[], [string]>(
    ['update-records'],
    (records) => api.updateRecords(uploadInfo._id, records),
    {
      onSuccess: () => {
        if (Object.keys(updateQueueRef.current).length === 0) {
          isProcessingRef.current = false;
          scheduleOnUpdate();
        } else {
          processBatch();
        }
      },
    }
  );

  const scheduleOnUpdate = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(() => {
      onUpdate?.();
      updateTimeoutRef.current = null;
    }, delay);
  }, [onUpdate, delay]);

  const processBatch = useCallback(() => {
    const queueEntries = Object.entries(updateQueueRef.current);
    if (queueEntries.length > 0) {
      const batchEntries = queueEntries.slice(0, batchSize);
      const batch = batchEntries.map(([, record]) => record);

      batchEntries.forEach(([key]) => delete updateQueueRef.current[Number(key)]);

      updateRecordBatch(batch);
    } else {
      isProcessingRef.current = false;
      scheduleOnUpdate();
    }
    timeoutRef.current = null;
  }, [batchSize, updateRecordBatch, scheduleOnUpdate]);

  const scheduleUpdate = useCallback(() => {
    if (timeoutRef.current === null && !isProcessingRef.current) {
      timeoutRef.current = setTimeout(() => {
        isProcessingRef.current = true;
        processBatch();
      }, delay);
    }
  }, [processBatch, delay]);

  const updateRecord = useCallback(
    (record: UpdateRecord) => {
      updateQueueRef.current[record.index] = record;

      if (Object.keys(updateQueueRef.current).length >= batchSize && !isProcessingRef.current) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        isProcessingRef.current = true;
        processBatch();
      } else {
        scheduleUpdate();
      }
    },
    [batchSize, processBatch, scheduleUpdate]
  );

  const flushUpdates = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (!isProcessingRef.current && Object.keys(updateQueueRef.current).length > 0) {
      isProcessingRef.current = true;
      processBatch();
    } else if (Object.keys(updateQueueRef.current).length === 0) {
      scheduleOnUpdate();
    }
  }, [processBatch, scheduleOnUpdate]);

  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return { updateRecord, flushUpdates };
}
