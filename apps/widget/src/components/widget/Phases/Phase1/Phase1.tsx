import { TEXTS, variables } from '@config';
import { Select } from '@ui/Select';
import { Button } from '@ui/Button';
import { Dropzone } from '@ui/Dropzone';
import { LoadingOverlay } from '@ui/LoadingOverlay';
import { Group } from '@mantine/core';
import { Download } from '@icons';
import useStyles from './Styles';
import { Footer } from 'components/Common/Footer';
import { usePhase1 } from '@hooks/Phase1/usePhase1';
import { Controller } from 'react-hook-form';
import { PhasesEnum } from '@types';

interface IPhase1Props {
  onNextClick: () => void;
}

export function Phase1(props: IPhase1Props) {
  const { classes } = useStyles();
  const { onNextClick: goNext } = props;
  const {
    onSubmit,
    control,
    templates,
    onDownload,
    setError,
    isUploadLoading,
    onTemplateChange,
    showSelectTemplate,
    isInitialDataLoaded,
    isDownloadInProgress,
  } = usePhase1({
    goNext,
  });

  return (
    <>
      <LoadingOverlay visible={!isInitialDataLoaded} />
      <Group className={classes.templateContainer} spacing="lg" noWrap>
        {showSelectTemplate && (
          <Controller
            name={`templateId`}
            control={control}
            rules={{
              required: TEXTS.VALIDATION.TEMPLATE_REQUIRED,
            }}
            render={({ field, fieldState }) => (
              <Select
                title={TEXTS.PHASE1.SELECT_TITLE}
                placeholder={TEXTS.PHASE1.SELECT_PLACEHOLDER}
                data={templates}
                width="50%"
                error={fieldState.error?.message}
                onChange={onTemplateChange}
                value={field.value}
                ref={field.ref}
              />
            )}
          />
        )}
        <div className={classes.download}>
          <Button loading={isDownloadInProgress} leftIcon={<Download />} onClick={onDownload}>
            {TEXTS.PHASE1.DOWNLOAD_SAMPLE}
          </Button>
        </div>
      </Group>

      <Controller
        control={control}
        name="file"
        rules={{
          required: TEXTS.VALIDATION.FILE_REQUIRED,
        }}
        render={({ field, fieldState }) => (
          <Dropzone
            loading={isUploadLoading}
            onReject={() => {
              setError('file', {
                message: `File type not supported! Please select a .csv or .xlsx file.`,
                type: 'manual',
              });
            }}
            className={classes.dropzone}
            onDrop={(selectedFile) => {
              field.onChange(selectedFile[variables.baseIndex]);
              setError('file', {});
            }}
            onClear={() => field.onChange(undefined)}
            title={TEXTS.PHASE1.SELECT_FILE}
            file={field.value}
            error={fieldState.error?.message}
          />
        )}
      />

      <Footer
        primaryButtonLoading={isUploadLoading}
        onNextClick={onSubmit}
        onPrevClick={() => {}}
        active={PhasesEnum.UPLOAD}
      />
    </>
  );
}
