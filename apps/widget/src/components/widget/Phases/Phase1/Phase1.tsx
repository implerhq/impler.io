import { TEXTS } from '@config';
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

interface IPhase1Props {
  onNextClick: () => void;
}

export function Phase1(props: IPhase1Props) {
  const { classes } = useStyles();
  const { onNextClick: goNext } = props;
  const {
    showSelectTemplate,
    onSubmit,
    control,
    templates,
    isInitialDataLoaded,
    isUploadLoading,
    onDownload,
    isDownloadInProgress,
  } = usePhase1({
    goNext,
  });

  return (
    <>
      <LoadingOverlay visible={!isInitialDataLoaded || isUploadLoading} />
      <Group className={classes.templateContainer} spacing="lg" noWrap>
        {showSelectTemplate && (
          <Controller
            name={`template`}
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
                {...field}
              />
            )}
          />
        )}
        <div className={classes.download}>
          <Button loading={isDownloadInProgress} size="sm" leftIcon={<Download />} onClick={onDownload}>
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
            className={classes.dropzone}
            onDrop={(selectedFile) => field.onChange(selectedFile[0])}
            onClear={() => field.onChange(undefined)}
            title={TEXTS.PHASE1.SELECT_FILE}
            file={field.value}
            error={fieldState.error?.message}
          />
        )}
      />

      <Footer primaryButtonLoading={isUploadLoading} onNextClick={onSubmit} onPrevClick={() => {}} active={1} />
    </>
  );
}
