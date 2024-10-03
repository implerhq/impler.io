import { useCallback, useEffect, useState } from 'react';

import { Modal } from '@ui/Modal';
import { variables } from '@config';
import { ParentWindow } from '@util';
import { IUpload } from '@impler/client';
import { useWidget } from '@hooks/useWidget';
import { useAppState } from '@store/app.context';
import { Layout } from 'components/Common/Layout';
import { ConfirmModal } from './modals/ConfirmModal';
import { useTemplates } from '@hooks/useTemplates';
import { FlowsEnum, PhasesEnum, PromptModalTypesEnum } from '@types';
import { logAmplitudeEvent, resetAmplitude } from '@amplitude';
import { IImportConfig, TemplateModeEnum } from '@impler/shared';

import { Phase0 } from './Phases/Phase0';
import { Phase1 } from './Phases/Phase1';
import { Phase2 } from './Phases/Phase2';
import { Phase3 } from './Phases/Phase3';
import { Phase4 } from './Phases/Phase4';
import { ImageUpload } from './Phases/ImageImport';
import { DataGrid } from './Phases/ManualEntryImport';
import { AutoImportPhase1 } from './Phases/AutoImport/AutoImportPhase1';
import { AutoImportPhase2 } from './Phases/AutoImport/AutoImportPhase2';
import { AutoImportPhase3 } from './Phases/AutoImport/AutoImportPhase3';
import { AutoImportPhase4 } from './Phases/AutoImport/AutoImportPhase4';

export function Widget() {
  const defaultDataCount = 0;
  const { hasImageUpload } = useTemplates();
  const { terminateUpload, phase, setPhase } = useWidget();
  const [dataCount, setDataCount] = useState<number>(defaultDataCount);
  const [promptContinueAction, setPromptContinueAction] = useState<PromptModalTypesEnum>();
  const {
    flow,
    title,
    texts,
    setFlow,
    uploadInfo,
    showWidget,
    templateInfo,
    importConfig,
    setShowWidget,
    setImportConfig,
    reset: resetAppState,
  } = useAppState();

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
    let isImportNotOnProgress = false;
    if (flow === FlowsEnum.AUTO_IMPORT)
      isImportNotOnProgress = [PhasesEnum.CONFIGURE, PhasesEnum.CONFIRM].includes(phase);
    else if (flow == FlowsEnum.MANUAL_ENTRY)
      isImportNotOnProgress = [PhasesEnum.MANUAL_ENTRY, PhasesEnum.SUBMIT].includes(phase);
    else
      isImportNotOnProgress = [
        PhasesEnum.VALIDATE,
        PhasesEnum.IMAGE_UPLOAD,
        PhasesEnum.UPLOAD,
        PhasesEnum.COMPLETE,
      ].includes(phase);

    if (isImportNotOnProgress) {
      setPhase(PhasesEnum.VALIDATE);
      resetAppState();
      closeWidget();
    } else setPromptContinueAction(PromptModalTypesEnum.CLOSE);
  };
  const closeWidget = () => {
    setShowWidget(false);
    resetAmplitude();
    setTimeout(() => {
      ParentWindow.Close();
    }, variables.closeDelayInMS);
  };
  const resetProgress = () => {
    resetAppState();
    resetAmplitude();
    setPhase(PhasesEnum.VALIDATE);
  };
  const onComplete = (uploadData: IUpload, importedData?: Record<string, any>[]) => {
    setDataCount(uploadData.totalRecords);
    setPhase(PhasesEnum.COMPLETE);
    ParentWindow.UploadCompleted(uploadData);
    if (importedData) ParentWindow.DataImported(importedData);
  };
  const onSuccess = useCallback(() => {
    setImportConfig((configData: IImportConfig) => {
      setPhase(
        configData.mode === TemplateModeEnum.AUTOMATIC
          ? PhasesEnum.CONFIGURE
          : hasImageUpload
          ? PhasesEnum.IMAGE_UPLOAD
          : PhasesEnum.UPLOAD
      );

      return configData;
    });
  }, [importConfig, hasImageUpload]);

  const PhaseView = {
    [PhasesEnum.VALIDATE]: <Phase0 onValidationSuccess={onSuccess} />,
    ...(flow === FlowsEnum.AUTO_IMPORT
      ? {
          [PhasesEnum.CONFIGURE]: <AutoImportPhase1 onNextClick={() => setPhase(PhasesEnum.MAPCOLUMNS)} />,
          [PhasesEnum.MAPCOLUMNS]: <AutoImportPhase2 texts={texts} onNextClick={() => setPhase(PhasesEnum.SCHEDULE)} />,
          [PhasesEnum.SCHEDULE]: <AutoImportPhase3 onNextClick={() => setPhase(PhasesEnum.CONFIRM)} texts={texts} />,
          [PhasesEnum.CONFIRM]: <AutoImportPhase4 onCloseClick={onClose} />,
        }
      : flow === FlowsEnum.MANUAL_ENTRY
      ? {
          [PhasesEnum.MANUAL_ENTRY]: <DataGrid texts={texts} onPrevClick={onUploadResetClick} onNextClick={onClose} />,
        }
      : {
          [PhasesEnum.IMAGE_UPLOAD]: <ImageUpload texts={texts} goToUpload={() => setPhase(PhasesEnum.UPLOAD)} />,
          [PhasesEnum.UPLOAD]: (
            <Phase1
              texts={texts}
              hasImageUpload={hasImageUpload}
              onNextClick={() => setPhase(PhasesEnum.MAPPING)}
              onManuallyEnterData={() => {
                setFlow(FlowsEnum.MANUAL_ENTRY);
                setPhase(PhasesEnum.MANUAL_ENTRY);
              }}
              generateImageTemplate={() => setPhase(PhasesEnum.IMAGE_UPLOAD)}
            />
          ),
          [PhasesEnum.MAPPING]: (
            <Phase2 texts={texts} onNextClick={() => setPhase(PhasesEnum.REVIEW)} onPrevClick={onUploadResetClick} />
          ),
          [PhasesEnum.REVIEW]: <Phase3 texts={texts} onNextClick={onComplete} onPrevClick={onUploadResetClick} />,
          [PhasesEnum.COMPLETE]: (
            <Phase4 texts={texts} rowsCount={dataCount} onUploadAgainClick={resetProgress} onCloseClick={onClose} />
          ),
        }),
  };

  useEffect(() => {
    if (!showWidget) {
      setPhase(PhasesEnum.VALIDATE);
    }
  }, [showWidget]);

  return (
    <Modal title={title || importConfig?.title || templateInfo?.name} opened={showWidget} onClose={onClose}>
      <Layout
        texts={texts}
        active={phase}
        onClose={onClose}
        hasImageUpload={hasImageUpload}
        mode={importConfig.mode as TemplateModeEnum}
        title={title || importConfig?.title || templateInfo?.name}
      >
        {PhaseView[phase]}

        <ConfirmModal
          onCancel={onPromptCancel}
          onConfirm={onPromptConfirm}
          title={texts.CLOSE_CONFIRMATION.TITLE}
          cancelLabel={texts.CLOSE_CONFIRMATION.CANCEL_CLOSE}
          confirmLabel={texts.CLOSE_CONFIRMATION.CONFIRM_CLOSE}
          opened={!!promptContinueAction}
          subTitle={texts.CLOSE_CONFIRMATION.DETAILS}
        />
      </Layout>
    </Modal>
  );
}
