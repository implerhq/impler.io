import { Flex, Group } from '@mantine/core';
import { Controller } from 'react-hook-form';
import { useMediaQuery } from '@mantine/hooks';

import { PhasesEnum } from '@types';
import { Select } from '@ui/Select';
import { Button } from '@ui/Button';
import { WIDGET_TEXTS } from '@impler/client';

import { DownloadIcon, BackIcon } from '@icons';
import { mantineConfig, variables } from '@config';
import { UploadDropzone } from '@ui/UploadDropzone';
import { usePhase1 } from '@hooks/Phase1/usePhase1';

import useStyles from './Phase1.Styles';
import { Divider } from '@ui/Divider';
import { Footer } from 'components/Common/Footer';
import { SheetSelectModal } from './SheetSelectModal';
import { ManaulEntryView } from './ManualEntryView';

interface IPhase1Props {
  onNextClick: () => void;
  hasImageUpload: boolean;
  texts: typeof WIDGET_TEXTS;
  generateImageTemplate: () => void;
}

export function Phase1({ onNextClick: goNext, hasImageUpload, generateImageTemplate, texts }: IPhase1Props) {
  const { classes } = useStyles();
  const isBiggerThanSm = useMediaQuery(`(min-width: ${mantineConfig.breakpoints?.sm}px)`);
  const {
    columns,
    onSubmit,
    control,
    setError,
    templates,
    onDownloadClick,
    excelSheetNames,
    isUploadLoading,
    onTemplateChange,
    onSelectExcelSheet,
    showSelectTemplate,
    isDownloadInProgress,
    onSelectSheetModalReset,
    isExcelSheetNamesLoading,
  } = usePhase1({
    goNext,
    texts,
  });
  const onDownload = () => {
    if (hasImageUpload) generateImageTemplate();
    else onDownloadClick();
  };

  return (
    <>
      <Group className={classes.templateContainer} spacing="lg" noWrap>
        {showSelectTemplate && (
          <Controller
            name={`templateId`}
            control={control}
            rules={{
              required: texts.PHASE1.SELECT_SHEET_REQUIRED_MSG,
            }}
            render={({ field, fieldState }) => (
              <Select
                width="50%"
                ref={field.ref}
                value={field.value}
                onChange={onTemplateChange}
                error={fieldState.error?.message}
                title={texts.PHASE1.SELECT_TEMPLATE_NAME}
                placeholder={texts.PHASE1.SELECT_TEMPLATE_NAME_PLACEHOLDER}
                data={templates?.map((template) => ({ value: template._id, label: template.name })) || []}
              />
            )}
          />
        )}
        <div className={classes.download}>
          <Button
            onClick={onDownload}
            loading={isDownloadInProgress}
            leftIcon={hasImageUpload ? <BackIcon /> : <DownloadIcon />}
          >
            {hasImageUpload ? texts.PHASE1.GENERATE_TEMPLATE : texts.PHASE1.DOWNLOAD_SAMPLE}
          </Button>
        </div>
      </Group>

      <Flex style={{ flexGrow: 1 }} justify="center" align="center">
        <Flex direction={{ base: 'column', sm: 'row' }} align="stretch" justify="center" gap="xs" w="75%">
          <Controller
            control={control}
            name="file"
            rules={{
              required: texts.PHASE1.SELECT_FILE_REQUIRED_MSG,
            }}
            render={({ field, fieldState }) => (
              <UploadDropzone
                texts={texts}
                loading={isUploadLoading}
                className={classes.contentWrapper}
                onReject={() => {
                  setError('file', {
                    message: texts.PHASE1.SELECT_FILE_FORMAT_MSG,
                    type: 'manual',
                  });
                }}
                onDrop={(selectedFile) => {
                  field.onChange(selectedFile[variables.baseIndex]);
                  onSubmit(selectedFile[variables.baseIndex]);
                }}
                error={fieldState.error?.message}
              />
            )}
          />
          <Divider orientation={isBiggerThanSm ? 'vertical' : 'horizontal'} label="OR" />

          <ManaulEntryView columns={columns} className={classes.contentWrapper} />
        </Flex>
      </Flex>

      <SheetSelectModal
        texts={texts}
        control={control}
        onSubmit={onSelectExcelSheet}
        excelSheetNames={excelSheetNames}
        opened={!!excelSheetNames.length}
        onClose={onSelectSheetModalReset}
      />

      <Footer active={PhasesEnum.UPLOAD} primaryButtonLoading={isUploadLoading || isExcelSheetNamesLoading} />
    </>
  );
}
