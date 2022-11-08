import { useState } from 'react';
import { Container } from './Container';
import { Phase1 } from './Phases/Phase1';
import { Phase2 } from './Phases/Phase2';
import { Phase3 } from './Phases/Phase3';
import { ConfirmModal } from './Phases/ConfirmModal';
import { PromptModal } from './Phases/PromptModal';
import { Phase4 } from './Phases/Phase4';
import { ParentWindow } from '@util';
import { PromptModalTypesEnum } from '@types';

export function Widget() {
  const [phase, setPhase] = useState<number>(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [promptContinueAction, setPromptContinueAction] = useState<PromptModalTypesEnum>();

  const onConfirm = () => {
    setShowConfirmModal(false);
    setPhase(4);
  };
  const onUploadResetClick = () => {
    setPromptContinueAction(PromptModalTypesEnum.UPLOAD_AGAIN);
  };
  const onPromptConfirm = () => {
    setPromptContinueAction(undefined);
    if (promptContinueAction === PromptModalTypesEnum.CLOSE) closeWidget();
    else if (promptContinueAction === PromptModalTypesEnum.UPLOAD_AGAIN) setPhase(1);
  };
  const onPromptCancel = () => {
    setPromptContinueAction(undefined);
  };
  const onClose = () => {
    if (phase !== 1) setPromptContinueAction(PromptModalTypesEnum.CLOSE);
    else closeWidget();
  };
  const closeWidget = () => {
    ParentWindow.Close();
  };

  return (
    <Container phase={phase} onClose={onClose}>
      {phase === 1 ? (
        <Phase1 onNextClick={() => setPhase(2)} />
      ) : phase === 2 ? (
        <Phase2 onNextClick={() => setPhase(3)} onPrevClick={onUploadResetClick} />
      ) : phase === 3 ? (
        <Phase3 onNextClick={() => setShowConfirmModal(true)} onPrevClick={() => setPhase(2)} />
      ) : phase === 4 ? (
        <Phase4 rowsCount={1000000} onUploadAgainClick={() => setPhase(1)} />
      ) : null}
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
