import { useState } from 'react';

import { Modal } from '@ui/Modal';
import { ParentWindow } from '@util';
import { TEXTS, variables } from '@config';
import { IUpload } from '@impler/shared';
import { Phase0 } from './Phases/Phase0';
import { Phase01 } from './Phases/Phase0-1';
import { Phase1 } from './Phases/Phase1';
import { Phase2 } from './Phases/Phase2';
import { Phase3 } from './Phases/Phase3';
import { Phase4 } from './Phases/Phase4';
import { useWidget } from '@hooks/useWidget';
import { useAppState } from '@store/app.context';
import { ConfirmModal } from './modals/ConfirmModal';
import { Layout } from 'components/Common/Layout';
import { useTemplates } from '@hooks/useTemplates';
import { PhasesEnum, PromptModalTypesEnum } from '@types';
import { logAmplitudeEvent, resetAmplitude } from '@amplitude';

export function Widget() {
  const defaultDataCount = 0;
  const { hasImageUpload } = useTemplates();
  const { terminateUpload, phase, setPhase } = useWidget();
  const [dataCount, setDataCount] = useState<number>(defaultDataCount);
  const [promptContinueAction, setPromptContinueAction] = useState<PromptModalTypesEnum>();
  const { showWidget, setShowWidget, reset: resetAppState, uploadInfo, templateInfo, title } = useAppState();

  const onUploadResetClick = () => {
    logAmplitudeEvent('RESET');
    setPromptContinueAction(PromptModalTypesEnum.UPLOAD_AGAIN);
  };
  const onPromptConfirm = () => {
    terminateUpload();
    setPromptContinueAction(undefined);
    if (uploadInfo._id) ParentWindow.UploadTerminated({ uploadId: uploadInfo._id });
    if (promptContinueAction === PromptModalTypesEnum.CLOSE) closeWidget();
  };
  const onPromptCancel = () => {
    setPromptContinueAction(undefined);
  };
  const onClose = () => {
    if ([PhasesEnum.VALIDATE, PhasesEnum.IMAGE_UPLOAD, PhasesEnum.UPLOAD, PhasesEnum.COMPLETE].includes(phase))
      closeWidget(true);
    else setPromptContinueAction(PromptModalTypesEnum.CLOSE);
  };
  const closeWidget = (resetPhase?: boolean) => {
    setShowWidget(false);
    resetAmplitude();
    resetAppState();
    if (resetPhase) setPhase(PhasesEnum.VALIDATE);
    setTimeout(() => {
      ParentWindow.Close();
    }, variables.closeDelayInMS);
  };
  const resetProgress = () => {
    resetAppState();
    setPhase(PhasesEnum.VALIDATE);
  };
  const onComplete = (uploadData: IUpload) => {
    setDataCount(uploadData.totalRecords);
    setPhase(PhasesEnum.COMPLETE);
    ParentWindow.UploadCompleted(uploadData);
  };

  const PhaseView = {
    [PhasesEnum.VALIDATE]: (
      <Phase0 onValidationSuccess={() => setPhase(hasImageUpload ? PhasesEnum.IMAGE_UPLOAD : PhasesEnum.UPLOAD)} />
    ),
    [PhasesEnum.IMAGE_UPLOAD]: <Phase01 goToUpload={() => setPhase(PhasesEnum.UPLOAD)} />,
    [PhasesEnum.UPLOAD]: (
      <Phase1
        hasImageUpload={hasImageUpload}
        onNextClick={() => setPhase(PhasesEnum.MAPPING)}
        generateImageTemplate={() => setPhase(PhasesEnum.IMAGE_UPLOAD)}
      />
    ),
    [PhasesEnum.MAPPING]: <Phase2 onNextClick={() => setPhase(PhasesEnum.REVIEW)} onPrevClick={onUploadResetClick} />,
    [PhasesEnum.REVIEW]: <Phase3 onNextClick={onComplete} onPrevClick={onUploadResetClick} />,
    [PhasesEnum.COMPLETE]: <Phase4 rowsCount={dataCount} onUploadAgainClick={resetProgress} onCloseClick={onClose} />,
  };
  const subTitle = {
    [PromptModalTypesEnum.CLOSE]: TEXTS.PROMPT.SUBTITLE_CLOSE,
    [PromptModalTypesEnum.UPLOAD_AGAIN]: TEXTS.PROMPT.SUBTITLE_RESET,
  };

  return (
    <Modal title={title || templateInfo?.name} opened={showWidget} onClose={onClose}>
      <Layout active={phase} title={title || templateInfo?.name} hasImageUpload={hasImageUpload}>
        {PhaseView[phase]}
        <ConfirmModal
          onCancel={onPromptCancel}
          title={TEXTS.PROMPT.TITLE}
          onConfirm={onPromptConfirm}
          cancelLabel={TEXTS.PROMPT.NO}
          confirmLabel={TEXTS.PROMPT.YES}
          opened={!!promptContinueAction}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          subTitle={subTitle[promptContinueAction!]}
        />
      </Layout>
    </Modal>
  );
}
