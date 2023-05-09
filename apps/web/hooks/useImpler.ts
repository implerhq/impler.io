import { useCallback, useState } from 'react';

interface UseImplerProps {
  projectId: string;
  templateId: string;
  accessToken?: string;
  primaryColor?: string;
  authHeaderValue?: string;
}

export function useImpler({ projectId, primaryColor, templateId, accessToken }: UseImplerProps) {
  const [isImplerInitiated, setIsImplerInitiated] = useState(false);

  const init = useCallback(() => {
    if (window.impler) {
      window.impler.init(projectId, { accessToken });
      setIsImplerInitiated(true);
      window.impler.on('message', onEventHappen);
    }
  }, [accessToken, projectId]);

  function onEventHappen() {}

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
