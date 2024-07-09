import { useState } from 'react';

import { Modal } from '@ui/Modal';
import { TEXTS, variables } from '@config';
import { ParentWindow } from '@util';
import { IUpload } from '@impler/shared';
import { Phase0 } from './Phases/Phase0';
import { Phase1 } from './Phases/Phase1';
import { Phase2 } from './Phases/Phase2';
import { Phase3 } from './Phases/Phase3';
import { Phase4 } from './Phases/Phase4';
import { useWidget } from '@hooks/useWidget';
import { useAppState } from '@store/app.context';
import { ConfirmModal } from './modals/ConfirmModal';
import { Layout } from 'components/Common/Layout';
import { PhasesEnum, PromptModalTypesEnum } from '@types';
import { logAmplitudeEvent, resetAmplitude } from '@amplitude';
import { AutoImportPhase0 } from './Phases/AutoImportPhases/AutoImportPhase0';
import { AutoImportPhase1 } from './Phases/AutoImportPhases/AutoImportPhase1';
import { AutoImportPhase2 } from './Phases/AutoImportPhases/AutoImportPhase2';
import { AutoImportPhase3 } from './Phases/AutoImportPhases/AutoImportPhase3';
import { ImportModeEnum } from '@impler/shared/src/types/importmode.enum';

export function Widget() {
  const defaultDataCount = 0;
  const { terminateUpload, phase, setPhase } = useWidget();
  const [dataCount, setDataCount] = useState<number>(defaultDataCount);
  const [promptContinueAction, setPromptContinueAction] = useState<PromptModalTypesEnum>();
  const { showWidget, setShowWidget, reset: resetAppState, uploadInfo, templateInfo, title } = useAppState();
  const { importConfig } = useAppState();

  const onUploadResetClick = () => {
    logAmplitudeEvent('RESET');
    setPromptContinueAction(PromptModalTypesEnum.UPLOAD_AGAIN);
  };
  const onPromptConfirm = () => {
    terminateUpload();
    setPromptContinueAction(undefined);
    ParentWindow.UploadTerminated({ uploadId: uploadInfo._id });
    if (promptContinueAction === PromptModalTypesEnum.CLOSE) closeWidget();
  };
  const onPromptCancel = () => {
    setPromptContinueAction(undefined);
  };
  const onClose = () => {
    if ([PhasesEnum.VALIDATE, PhasesEnum.UPLOAD, PhasesEnum.COMPLETE].includes(phase)) closeWidget(true);
    else setPromptContinueAction(PromptModalTypesEnum.CLOSE);
  };
  const closeWidget = (resetPhase?: boolean) => {
    setShowWidget(false);
    resetAmplitude();
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

  const importMode = importConfig.mode;

  const PhaseView =
    importMode === ImportModeEnum.MANUAL
      ? {
          [PhasesEnum.VALIDATE]: <Phase0 onValidationSuccess={() => setPhase(PhasesEnum.UPLOAD)} />,
          [PhasesEnum.UPLOAD]: <Phase1 onNextClick={() => setPhase(PhasesEnum.MAPPING)} />,
          [PhasesEnum.MAPPING]: (
            <Phase2 onNextClick={() => setPhase(PhasesEnum.REVIEW)} onPrevClick={onUploadResetClick} />
          ),
          [PhasesEnum.REVIEW]: <Phase3 onNextClick={onComplete} onPrevClick={onUploadResetClick} />,
          [PhasesEnum.COMPLETE]: (
            <Phase4 rowsCount={dataCount} onUploadAgainClick={resetProgress} onCloseClick={onClose} />
          ),
        }
      : {
          [PhasesEnum.CONFIGURE]: <AutoImportPhase0 {...() => setPhase(PhasesEnum.CONFIGURE)} />,
          [PhasesEnum.MAPCOLUMNS]: <AutoImportPhase1 {...() => setPhase(PhasesEnum.MAPCOLUMNS)} />,
          [PhasesEnum.SCHEDULE]: <AutoImportPhase2 {...() => setPhase(PhasesEnum.SCHEDULE)} />,
          [PhasesEnum.CONFORM]: <AutoImportPhase3 {...() => setPhase(PhasesEnum.CONFORM)} />,
        };

  const subTitle = {
    [PromptModalTypesEnum.CLOSE]: TEXTS.PROMPT.SUBTITLE_CLOSE,
    [PromptModalTypesEnum.UPLOAD_AGAIN]: TEXTS.PROMPT.SUBTITLE_RESET,
  };

  return (
    <Modal title={title || templateInfo?.name} opened={showWidget} onClose={onClose}>
      <Layout active={phase} title={title || templateInfo?.name}>
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
