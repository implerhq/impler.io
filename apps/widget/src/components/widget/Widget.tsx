import { useState } from 'react';
import { Container } from './Container';
import { Phase1 } from './Phases/Phase1';
import { Phase2 } from './Phases/Phase2';
import { Phase3 } from './Phases/Phase3';
import { ConfirmModal } from './Phases/ConfirmModal';
import { PromptModal } from './Phases/PromptModal';
import { Phase4 } from './Phases/Phase4';
import { ParentWindow } from '@util';
import { PhasesEum, PromptModalTypesEnum } from '@types';
import { useQueryClient } from '@tanstack/react-query';

export function Widget() {
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<PhasesEum>(PhasesEum.UPLOAD);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [promptContinueAction, setPromptContinueAction] = useState<PromptModalTypesEnum>();

  const onConfirm = () => {
    setShowConfirmModal(false);
    setPhase(PhasesEum.CONFIRMATION);
  };
  const onUploadResetClick = () => {
    setPromptContinueAction(PromptModalTypesEnum.UPLOAD_AGAIN);
  };
  const onPromptConfirm = () => {
    setPromptContinueAction(undefined);
    if (promptContinueAction === PromptModalTypesEnum.CLOSE) closeWidget();
    resetProgress();
  };
  const onPromptCancel = () => {
    setPromptContinueAction(undefined);
  };
  const onClose = () => {
    if (phase !== PhasesEum.UPLOAD) setPromptContinueAction(PromptModalTypesEnum.CLOSE);
    else closeWidget();
  };
  const closeWidget = () => {
    ParentWindow.Close();
  };
  const resetProgress = () => {
    queryClient.clear();
    setPhase(PhasesEum.UPLOAD);
  };

  const PhaseView = {
    [PhasesEum.UPLOAD]: <Phase1 onNextClick={() => setPhase(PhasesEum.MAPPING)} />,
    [PhasesEum.MAPPING]: <Phase2 onNextClick={() => setPhase(PhasesEum.REVIEW)} onPrevClick={onUploadResetClick} />,
    [PhasesEum.REVIEW]: <Phase3 onNextClick={() => setShowConfirmModal(true)} onPrevClick={onUploadResetClick} />,
    [PhasesEum.CONFIRMATION]: <Phase4 rowsCount={1000000} onUploadAgainClick={onUploadResetClick} />,
  };

  return (
    <Container phase={phase} onClose={onClose}>
      {PhaseView[phase]}
      <ConfirmModal
        onConfirm={onConfirm}
        onClose={() => setShowConfirmModal(false)}
        opened={showConfirmModal}
        wrongDataCount={8}
      />
      <PromptModal
        onCancel={onPromptCancel}
        onConfirm={onPromptConfirm}
        opened={!!promptContinueAction}
        action={promptContinueAction}
      />
    </Container>
  );
}
