import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { PhasesEnum } from '@types';
import { IUpload } from '@impler/client';
import { IErrorObject } from '@impler/shared';
import { useAppState } from '@store/app.context';
import { useAPIState } from '@store/api.context';
import { useTemplates } from './useTemplates';

export function useWidget() {
  const { api } = useAPIState();
  const { hasImageUpload } = useTemplates();
  const { reset: resetAppState, uploadInfo } = useAppState();
  const [phase, setPhase] = useState<PhasesEnum>(PhasesEnum.VALIDATE);

  const { mutate: terminateUpload } = useMutation<IUpload, IErrorObject, void, string[]>(
    ['terminate', uploadInfo._id],
    () => api.terminateUpload(uploadInfo._id),
    {
      onSuccess: () => {
        resetAppState();
        if (hasImageUpload) setPhase(PhasesEnum.IMAGE_UPLOAD);
        else setPhase(PhasesEnum.UPLOAD);
      },
    }
  );

  return {
    phase,
    setPhase,
    terminateUpload,
  };
}
