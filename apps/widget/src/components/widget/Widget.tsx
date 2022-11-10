import { useState } from 'react';
import { Container } from './Container';
import { Phase1 } from './Phases/Phase1';
import { Phase2 } from './Phases/Phase2';
import { Phase3 } from './Phases/Phase3';
import { PromptModal } from './Phases/PromptModal';
import { Phase4 } from './Phases/Phase4';
import { ParentWindow } from '@util';
import { PhasesEum, PromptModalTypesEnum } from '@types';
import { useQueryClient } from '@tanstack/react-query';

export function Widget() {
  const defaultDataCount = 0;
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<PhasesEum>(PhasesEum.UPLOAD);
  const [dataCount, setDataCount] = useState<number>(defaultDataCount);
  const [promptContinueAction, setPromptContinueAction] = useState<PromptModalTypesEnum>();

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
    if ([PhasesEum.UPLOAD, PhasesEum.COMPLETE].includes(phase)) closeWidget();
    else setPromptContinueAction(PromptModalTypesEnum.CLOSE);
  };
  const closeWidget = () => {
    ParentWindow.Close();
  };
  const resetProgress = () => {
    queryClient.clear();
    setPhase(PhasesEum.UPLOAD);
  };
  const onComplete = (count: number) => {
    setDataCount(count);
    setPhase(PhasesEum.COMPLETE);
  };

  const PhaseView = {
    [PhasesEum.UPLOAD]: <Phase1 onNextClick={() => setPhase(PhasesEum.MAPPING)} />,
    [PhasesEum.MAPPING]: <Phase2 onNextClick={() => setPhase(PhasesEum.REVIEW)} onPrevClick={onUploadResetClick} />,
    [PhasesEum.REVIEW]: <Phase3 onNextClick={onComplete} onPrevClick={onUploadResetClick} />,
    [PhasesEum.COMPLETE]: <Phase4 rowsCount={dataCount} onUploadAgainClick={resetProgress} onCloseClick={onClose} />,
  };

  return (
    <Container phase={phase} onClose={onClose}>
      {PhaseView[phase]}
      <PromptModal
        onCancel={onPromptCancel}
        onConfirm={onPromptConfirm}
        opened={!!promptContinueAction}
        action={promptContinueAction}
      />
    </Container>
  );
}
