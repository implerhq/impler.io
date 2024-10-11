import { useCallback, useEffect, useState } from 'react';
import { isObject, EventTypes, logError, EventCalls, IShowWidgetProps, IUseImplerProps } from '@impler/client';

export function useImpler({
  projectId,
  primaryColor,
  templateId,
  accessToken,
  authHeaderValue,
  title,
  texts,
  extra,
  onUploadComplete,
  onWidgetClose,
  onUploadStart,
  onDataImported,
  onUploadTerminate,
  onImportJobCreated,
}: IUseImplerProps) {
  const [uuid] = useState(generateUuid());
  const [isImplerInitiated, setIsImplerInitiated] = useState(false);

  const onEventHappen = useCallback(
    (eventData: EventCalls) => {
      switch (eventData.type) {
        case EventTypes.UPLOAD_STARTED:
          if (onUploadStart) onUploadStart(eventData.value);
          break;
        case EventTypes.UPLOAD_TERMINATED:
          if (onUploadTerminate) onUploadTerminate(eventData.value);
          break;
        case EventTypes.UPLOAD_COMPLETED:
          if (onUploadComplete) onUploadComplete(eventData.value);
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
    [onUploadComplete, onUploadStart, onUploadTerminate, onWidgetClose]
  );

  useEffect(() => {
    const readyCheckInterval = setInterval(() => {
      if (window.impler && window.impler.isReady()) {
        setIsImplerInitiated(true);
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
      window.impler.on('message', onEventHappen, uuid);
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
    schema,
    output,
  }: Pick<IShowWidgetProps, 'colorScheme' | 'data' | 'schema' | 'output'> = {}) => {
    if (window.impler && isImplerInitiated) {
      const payload: IShowWidgetProps & { uuid: string; host: string } = {
        uuid,
        templateId,
        host: '',
        projectId,
        accessToken,
        schema,
        data,
        output,
        title,
        extra,
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
