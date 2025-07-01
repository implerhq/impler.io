import { useCallback, useEffect, useState, useRef } from 'react';

import { Modal } from '@ui/Modal';
import { variables } from '@config';
import { ParentWindow } from '@util';
import { IUpload } from '@impler/client';
import { useWidget } from '@hooks/useWidget';
import { useAppState } from '@store/app.context';
import { Layout } from 'components/Common/Layout';
import { useTemplates } from '@hooks/useTemplates';
import { ConfirmModal } from './modals/ConfirmModal';
import { logAmplitudeEvent, resetAmplitude } from '@amplitude';
import { IImportConfig, IUserJob, TemplateModeEnum } from '@impler/shared';
import { FlowsEnum, PhasesEnum, PromptModalTypesEnum } from '@types';

import { Phase0 } from './Phases/Phase0';
import { Phase1 } from './Phases/Phase1';
import { Phase2 } from './Phases/Phase2';
import { Phase3 } from './Phases/Phase3';
import { Phase4 } from './Phases/Phase4';
import { ImageUpload } from './Phases/ImageImport';
import { SelectHeader } from './Phases/SelectHeader';
import { DataGrid } from './Phases/DirectEntryImport';
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
  // Add state to track RSS parsing status
  const [isRssParsing, setIsRssParsing] = useState<boolean>(false);

  // Add ref to store abort function from AutoImportPhase1
  const abortRssOperationRef = useRef<(() => void) | null>(null);
  const disconnectSocketRef = useRef<(() => void) | null>(null);

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
    // If we're closing during RSS parsing, abort the RSS operation first
    if (promptContinueAction === PromptModalTypesEnum.CLOSE && isRssParsing && abortRssOperationRef.current) {
      abortRssOperationRef.current();
    }

    if (promptContinueAction === PromptModalTypesEnum.CLOSE && disconnectSocketRef.current) {
      disconnectSocketRef.current();
    }

    terminateUpload();

    setPromptContinueAction(undefined);
    if (uploadInfo._id) ParentWindow.UploadTerminated({ uploadId: uploadInfo._id });
    if (promptContinueAction === PromptModalTypesEnum.CLOSE) closeWidget();
  };

  // Add callback to register disconnect function from AutoImportPhase1
  const handleRegisterDisconnectFunction = useCallback((disconnectFn: () => void) => {
    if (promptContinueAction === PromptModalTypesEnum.CLOSE) {
    }
    disconnectSocketRef.current = disconnectFn;
  }, []);

  const onPromptCancel = () => {
    setPromptContinueAction(undefined);
  };

  const onClose = () => {
    let isImportNotOnProgress = false;

    // If RSS is actively parsing, show confirmation dialog but DON'T disconnect socket yet
    if (flow === FlowsEnum.AUTO_IMPORT && phase === PhasesEnum.CONFIGURE && isRssParsing) {
      setPromptContinueAction(PromptModalTypesEnum.CLOSE);

      return;
    }

    // For other AUTO_IMPORT phases
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
      if (disconnectSocketRef.current) disconnectSocketRef.current();
      setPhase(PhasesEnum.VALIDATE);
      resetAppState();
      closeWidget();
    } else {
      setPromptContinueAction(PromptModalTypesEnum.CLOSE);
    }
  };

  const closeWidget = () => {
    setShowWidget(false);
    resetAmplitude();
    // Reset RSS parsing state when closing
    setIsRssParsing(false);
    // Clear the abort function reference
    abortRssOperationRef.current = null;
    // Clear the disconnect function reference
    disconnectSocketRef.current = null;
    setTimeout(() => {
      ParentWindow.Close();
    }, variables.closeDelayInMS);
  };

  const resetProgress = () => {
    resetAppState();
    resetAmplitude();
    setPhase(PhasesEnum.VALIDATE);
    setIsRssParsing(false); // Reset RSS parsing state
    abortRssOperationRef.current = null; // Clear abort function reference
    disconnectSocketRef.current = null; // Clear disconnect function reference
  };

  const onImportJobCreated = (jobInfo: IUserJob) => {
    ParentWindow.ImportJobCreated(jobInfo);
    setPhase(PhasesEnum.CONFIRM);
  };

  const onComplete = (uploadData: IUpload, importedData?: Record<string, any>[], doClose = false) => {
    setDataCount(uploadData.totalRecords);
    setPhase(PhasesEnum.COMPLETE);
    ParentWindow.UploadCompleted(uploadData);
    if (importedData) ParentWindow.DataImported(importedData);
    if (doClose) closeWidget();
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

  // Callback to register abort function from AutoImportPhase1
  const handleRegisterAbortFunction = useCallback((abortFn: () => void) => {
    abortRssOperationRef.current = abortFn;
  }, []);

  const PhaseView = {
    [PhasesEnum.VALIDATE]: <Phase0 onValidationSuccess={onSuccess} />,
    ...(flow === FlowsEnum.AUTO_IMPORT
      ? {
          [PhasesEnum.CONFIGURE]: (
            <AutoImportPhase1
              onNextClick={() => setPhase(PhasesEnum.MAPCOLUMNS)}
              onCloseClick={onClose}
              onRssParsingStart={() => setIsRssParsing(true)}
              onRssParsingEnd={() => setIsRssParsing(false)}
              onRegisterAbortFunction={handleRegisterAbortFunction}
              onRegisterDisconnectFunction={handleRegisterDisconnectFunction}
            />
          ),
          [PhasesEnum.MAPCOLUMNS]: <AutoImportPhase2 texts={texts} onNextClick={() => setPhase(PhasesEnum.SCHEDULE)} />,
          [PhasesEnum.SCHEDULE]: <AutoImportPhase3 onNextClick={onImportJobCreated} texts={texts} />,
          [PhasesEnum.CONFIRM]: <AutoImportPhase4 onCloseClick={onClose} />,
        }
      : flow === FlowsEnum.MANUAL_ENTRY
      ? {
          [PhasesEnum.MANUAL_ENTRY]: (
            <DataGrid
              texts={texts}
              onPrevClick={onUploadResetClick}
              onNextClick={(uploadData, importedData) => onComplete(uploadData, importedData, true)}
            />
          ),
        }
      : {
          [PhasesEnum.IMAGE_UPLOAD]: <ImageUpload texts={texts} goToUpload={() => setPhase(PhasesEnum.UPLOAD)} />,
          [PhasesEnum.UPLOAD]: (
            <Phase1
              texts={texts}
              hasImageUpload={hasImageUpload}
              onNextClick={() => setPhase(PhasesEnum.SELECT_HEADER)}
              onManuallyEnterData={() => {
                setFlow(FlowsEnum.MANUAL_ENTRY);
                setPhase(PhasesEnum.MANUAL_ENTRY);
              }}
              generateImageTemplate={() => setPhase(PhasesEnum.IMAGE_UPLOAD)}
            />
          ),
          [PhasesEnum.SELECT_HEADER]: <SelectHeader texts={texts} onNext={() => setPhase(PhasesEnum.MAPPING)} />,
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
      setIsRssParsing(false); // Reset RSS parsing state when widget is hidden
      abortRssOperationRef.current = null; // Clear abort function reference
      disconnectSocketRef.current = null; // Clear disconnect function reference
    }
  }, [showWidget]);

  return (
    <Modal title={title || importConfig?.title || templateInfo?.name} opened={showWidget} onClose={onClose}>
      <Layout active={phase} onClose={onClose} title={title || importConfig?.title || templateInfo?.name}>
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
