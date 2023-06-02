import { EventTypesEnum, IShowPayload, IUpload } from '@impler/shared';
import { useCallback, useEffect, useState } from 'react';
import { logError } from '../utils/logger';
import { EventCalls, UploadTemplateData, UploadData } from '../components/button/Button.types';

interface ShowWidgetProps {
  colorScheme?: 'light' | 'dark';
}

interface UseImplerProps {
  projectId: string;
  templateId?: string;
  accessToken?: string;
  primaryColor?: string;
  authHeaderValue?: string;
  onUploadStart?: (value: UploadTemplateData) => void;
  onUploadTerminate?: (value: UploadData) => void;
  onUploadComplete?: (value: IUpload) => void;
  onWidgetClose?: () => void;
}

export function useImpler({
  projectId,
  primaryColor,
  templateId,
  accessToken,
  onUploadComplete,
  onWidgetClose,
  onUploadStart,
  onUploadTerminate,
}: UseImplerProps) {
  const [isImplerInitiated, setIsImplerInitiated] = useState(false);

  const onEventHappen = useCallback(
    (data: EventCalls) => {
      switch (data.type) {
        case EventTypesEnum.WIDGET_READY:
          setIsImplerInitiated(true);
          break;
        case EventTypesEnum.UPLOAD_STARTED:
          if (onUploadStart) onUploadStart(data.value);
          break;
        case EventTypesEnum.UPLOAD_TERMINATED:
          if (onUploadTerminate) onUploadTerminate(data.value);
          break;
        case EventTypesEnum.UPLOAD_COMPLETED:
          if (onUploadComplete) onUploadComplete(data.value);
          break;
        case EventTypesEnum.CLOSE_WIDGET:
          if (onWidgetClose) onWidgetClose();
          break;
      }
    },
    [onUploadComplete, onUploadStart, onUploadTerminate, onWidgetClose]
  );

  const initWidget = useCallback(() => {
    if (window.impler) {
      window.impler.init(projectId, { accessToken });
      window.impler.on('message', onEventHappen);
    }
  }, [accessToken, onEventHappen, projectId]);

  useEffect(() => {
    if (!window.impler) logError('IMPLER_UNDEFINED_ERROR');
    else if (!projectId) logError('PROJECTID_NOT_SPECIFIED');
    else initWidget();
  }, [accessToken, templateId, initWidget]);

  const showWidget = ({ colorScheme }: ShowWidgetProps) => {
    if (isImplerInitiated) {
      const payload: IShowPayload = {
        templateId,
      };
      if (colorScheme) payload.colorScheme = colorScheme;
      else {
        const preferColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        payload.colorScheme = preferColorScheme;
      }
      if (primaryColor) payload.primaryColor = primaryColor;
      if (window.impler && isImplerInitiated) {
        window.impler.show(payload);
      }
    }
  };

  return { isImplerInitiated, showWidget };
}
