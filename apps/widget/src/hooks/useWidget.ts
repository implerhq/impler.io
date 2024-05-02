import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { PhasesEnum } from '@types';
import { IErrorObject, IUpload } from '@impler/shared';
import { useAppState } from '@store/app.context';
import { useAPIState } from '@store/api.context';

export function useWidget() {
  const { api } = useAPIState();
  const { reset: resetAppState, uploadInfo } = useAppState();
  const [phase, setPhase] = useState<PhasesEnum>(PhasesEnum.VALIDATE);

  const { mutate: terminateUpload } = useMutation<IUpload, IErrorObject, void, string[]>(
    ['terminate', uploadInfo._id],
    () => api.terminateUpload(uploadInfo._id),
    {
      onSuccess: () => {
        resetAppState();
        setPhase(PhasesEnum.VALIDATE);
      },
    }
  );

  return {
    phase,
    setPhase,
    terminateUpload,
  };
}
