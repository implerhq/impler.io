import { useCallback, useEffect, useRef, useState } from 'react';
import { isObject, EventTypes, logError, EventCalls, IShowWidgetProps, IUseImplerProps } from '@impler/client';

export function useImpler({
  projectId,
  primaryColor,
  templateId,
  accessToken,
  authHeaderValue,
  title,
  texts,
  extra: defaultExtra,
  config,
  maxRecords,
  appearance,
  onUploadComplete,
  onWidgetClose,
  onUploadStart,
  onDataImported,
  onUploadTerminate,
  onImportJobCreated,
  onWidgetReady,
  onUploadSuccess,
  onUploadError,
}: IUseImplerProps) {
  const [uuid] = useState(generateUuid());
  const [isImplerInitiated, setIsImplerInitiated] = useState(false);
  const onWidgetReadyCalledRef = useRef(false);

  /*
   * Use a ref so the listener always calls the latest version of callbacks
   * without needing to re-register with the embed library
   */
  const onEventHappenRef = useRef<(eventData: EventCalls) => void>(() => {});

  const onEventHappen = useCallback(
    (eventData: EventCalls) => {
      switch (eventData.type) {
        case EventTypes.WIDGET_READY:
          if (onWidgetReady && !onWidgetReadyCalledRef.current) {
            onWidgetReadyCalledRef.current = true;
            onWidgetReady();
          }
          break;
        case EventTypes.UPLOAD_STARTED:
          if (onUploadStart) onUploadStart(eventData.value);
          break;
        case EventTypes.UPLOAD_TERMINATED:
          if (onUploadTerminate) onUploadTerminate(eventData.value);
          break;
        case EventTypes.UPLOAD_COMPLETED:
          if (onUploadComplete) onUploadComplete(eventData.value);
          break;
        case EventTypes.UPLOAD_SUCCESS:
          if (onUploadSuccess) onUploadSuccess(eventData.value);
          break;
        case EventTypes.UPLOAD_ERROR:
          if (onUploadError) onUploadError(eventData.value);
          break;
        case EventTypes.DATA_IMPORTED:
          if (onDataImported) onDataImported(eventData.value);
          break;
        case EventTypes.CLOSE_WIDGET:
          if (onWidgetClose) onWidgetClose();
          break;
        case EventTypes.IMPORT_JOB_CREATED:
          if (onImportJobCreated) onImportJobCreated(eventData.value);
          break;
      }
    },
    [
      onUploadComplete,
      onUploadStart,
      onUploadTerminate,
      onWidgetClose,
      onDataImported,
      onImportJobCreated,
      onWidgetReady,
      onUploadSuccess,
      onUploadError,
    ]
  );

  // Keep ref in sync with latest callback
  useEffect(() => {
    onEventHappenRef.current = onEventHappen;
  }, [onEventHappen]);

  useEffect(() => {
    const readyCheckInterval = setInterval(() => {
      if (window.impler && window.impler.isReady()) {
        setIsImplerInitiated(true);
        if (onWidgetReady && !onWidgetReadyCalledRef.current) {
          onWidgetReadyCalledRef.current = true;
          onWidgetReady();
        }
        clearInterval(readyCheckInterval);
      }
    }, 1000);

    return () => {
      clearInterval(readyCheckInterval);
    };
  }, []);

  useEffect(() => {
    if (!window.impler) logError('IMPLER_UNDEFINED_ERROR');
    else {
      window.impler.init(uuid);
      /*
       * Use a stable wrapper that delegates to the ref,
       * so the embed always calls the latest version of onEventHappen
       */
      window.impler.on('message', (data: EventCalls) => onEventHappenRef.current(data), uuid);
    }
  }, []);

  function generateUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (cv) {
      const cr = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0;
      const vv = cv === 'x' ? cr : (cr & 0x3) | 0x8;

      return vv.toString(16);
    });
  }

  const showWidget = async ({
    colorScheme,
    data,
    sampleFile,
    schema,
    output,
    extra = defaultExtra,
  }: Pick<IShowWidgetProps, 'colorScheme' | 'data' | 'schema' | 'output' | 'sampleFile' | 'extra'> = {}) => {
    if (window.impler && isImplerInitiated) {
      const payload: IShowWidgetProps & { uuid: string; host: string } = {
        uuid,
        templateId,
        host: '',
        projectId,
        accessToken,
        schema,
        data,
        sampleFile,
        output,
        title,
        extra,
        config,
        appearance,
        maxRecords,
        colorScheme,
        primaryColor,
      };
      if (!colorScheme) {
        const preferColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        payload.colorScheme = preferColorScheme;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (isObject(texts)) payload.texts = JSON.stringify(texts);
      if (authHeaderValue) {
        if (typeof authHeaderValue === 'function' && authHeaderValue.constructor.name === 'AsyncFunction') {
          payload.authHeaderValue = await authHeaderValue();
        } else if (typeof authHeaderValue === 'function') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          payload.authHeaderValue = authHeaderValue();
        } else {
          payload.authHeaderValue = authHeaderValue;
        }
      }
      window.impler.show(payload);
    } else logError('IMPLER_UNDEFINED_ERROR');
  };

  const closeWidget = () => {
    if (window.impler) {
      window.impler.close();
    } else logError('IMPLER_UNDEFINED_ERROR');
  };

  return { isImplerInitiated, showWidget, closeWidget };
}
