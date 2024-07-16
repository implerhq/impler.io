import { useCallback, useEffect, useState } from 'react';
import { EventTypesEnum, IShowPayload } from '@impler/shared';

import { logError } from '../utils/logger';
import { EventCalls, ShowWidgetProps, UseImplerProps } from '../types';

export function useImpler({
  projectId,
  primaryColor,
  templateId,
  accessToken,
  authHeaderValue,
  title,
  extra,
  onUploadComplete,
  onWidgetClose,
  onUploadStart,
  onDataImported,
  onUploadTerminate,
}: UseImplerProps) {
  const [uuid] = useState(generateUuid());
  const [isImplerInitiated, setIsImplerInitiated] = useState(false);

  const onEventHappen = useCallback(
    (eventData: EventCalls) => {
      switch (eventData.type) {
        case EventTypesEnum.UPLOAD_STARTED:
          if (onUploadStart) onUploadStart(eventData.value);
          break;
        case EventTypesEnum.UPLOAD_TERMINATED:
          if (onUploadTerminate) onUploadTerminate(eventData.value);
          break;
        case EventTypesEnum.UPLOAD_COMPLETED:
          if (onUploadComplete) onUploadComplete(eventData.value);
          break;
        case EventTypesEnum.DATA_IMPORTED:
          if (onDataImported) onDataImported(eventData.value);
          break;
        case EventTypesEnum.CLOSE_WIDGET:
          if (onWidgetClose) onWidgetClose();
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

  const showWidget = async ({ colorScheme, data, schema, output }: ShowWidgetProps) => {
    if (window.impler && isImplerInitiated) {
      const payload: IShowPayload = {
        uuid,
        templateId,
        data,
        host: '',
        projectId,
        accessToken,
      };
      if (Array.isArray(schema) && schema.length > 0) {
        payload.schema = JSON.stringify(schema);
      }
      if (typeof output === 'object' && !Array.isArray(output) && output !== null) {
        payload.output = JSON.stringify(output);
      }
      if (title) payload.title = title;
      if (colorScheme) payload.colorScheme = colorScheme;
      else {
        const preferColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        payload.colorScheme = preferColorScheme;
      }
      if (primaryColor) payload.primaryColor = primaryColor;
      if (extra) {
        if (typeof extra === 'object') payload.extra = JSON.stringify(extra);
        else payload.extra = extra;
      }
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
    }
  };

  return { isImplerInitiated, showWidget };
}
