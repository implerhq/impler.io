import { EventTypesEnum } from '@impler/shared';
import { useCallback, useState } from 'react';

interface UseImplerProps {
  projectId: string;
  templateId: string;
  accessToken?: string;
  primaryColor?: string;
  authHeaderValue?: string;
  onUploadComplete?: () => void;
}

export function useImpler({ projectId, primaryColor, templateId, accessToken, onUploadComplete }: UseImplerProps) {
  const [isImplerInitiated, setIsImplerInitiated] = useState(false);

  const onEventHappen = useCallback(
    ({ type }: { type: EventTypesEnum }) => {
      switch (type) {
        case EventTypesEnum.UPLOAD_COMPLETED:
          if (onUploadComplete) onUploadComplete();
      }
    },
    [onUploadComplete]
  );

  const init = useCallback(() => {
    if (window.impler) {
      window.impler.init(projectId, { accessToken });
      setIsImplerInitiated(true);
      window.impler.on('message', onEventHappen);
    }
  }, [accessToken, onEventHappen, projectId]);

  function onImportClick() {
    const payload: {
      templateId: string;
      primaryColor?: string;
    } = {
      templateId,
    };
    if (primaryColor) payload.primaryColor = primaryColor;
    if (window.impler && isImplerInitiated) {
      window.impler.show(payload);
    }
  }

  return { init, isImplerInitiated, onImportClick };
}
