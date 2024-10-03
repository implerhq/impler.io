import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { IUpload } from '@impler/client';
import { IErrorObject } from '@impler/shared';
import { FlowsEnum, PhasesEnum } from '@types';
import { useAppState } from '@store/app.context';
import { useAPIState } from '@store/api.context';

export function useWidget() {
  const { api } = useAPIState();
  const { reset: resetAppState, uploadInfo, flow, setFlow } = useAppState();
  const [phase, setPhase] = useState<PhasesEnum>(PhasesEnum.VALIDATE);

  const { mutate: terminateUpload } = useMutation<IUpload, IErrorObject, void, string[]>(
    ['terminate', uploadInfo._id],
    () => api.terminateUpload(uploadInfo._id),
    {
      onSuccess: () => {
        resetAppState();
        switch (flow) {
          case FlowsEnum.IMAGE_IMPORT:
            setPhase(PhasesEnum.IMAGE_UPLOAD);
            break;
          case FlowsEnum.MANUAL_ENTRY:
          case FlowsEnum.STRAIGHT_IMPORT:
            setPhase(PhasesEnum.UPLOAD);
            setFlow(FlowsEnum.STRAIGHT_IMPORT);
            break;
          case FlowsEnum.AUTO_IMPORT:
            setPhase(PhasesEnum.CONFIGURE);
            break;
          default:
            break;
        }
      },
    }
  );

  return {
    phase,
    setPhase,
    terminateUpload,
  };
}
