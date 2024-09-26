import { Box, Divider, Flex, Group, Skeleton, Table, Text } from '@mantine/core';
import { Controller } from 'react-hook-form';

import { PhasesEnum } from '@types';
import { Select } from '@ui/Select';
import { Button } from '@ui/Button';

import { variables } from '@config';
import { WIDGET_TEXTS } from '@impler/client';
import { DownloadIcon, BackIcon, Warning, GridIcon } from '@icons';
import { UploadDropzone } from '@ui/UploadDropzone';
import { usePhase1 } from '@hooks/Phase1/usePhase1';

import useStyles from './Styles';
import { Footer } from 'components/Common/Footer';
import { SheetSelectModal } from './SheetSelectModal';

interface IPhase1Props {
  onNextClick: () => void;
  hasImageUpload: boolean;
  generateImageTemplate: () => void;
  texts: typeof WIDGET_TEXTS;
}

export function Phase1({ onNextClick: goNext, hasImageUpload, generateImageTemplate, texts }: IPhase1Props) {
  const { classes } = useStyles();
  const {
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

      <Flex direction="row" style={{ flexGrow: 1 }}>
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
              onReject={() => {
                setError('file', {
                  message: texts.PHASE1.SELECT_FILE_FORMAT_MSG,
                  type: 'manual',
                });
              }}
              onDrop={(selectedFile) => {
                field.onChange(selectedFile[variables.baseIndex]);
                setError('file', {});
              }}
              onClear={() => field.onChange(undefined)}
              file={field.value}
              error={fieldState.error?.message}
            />
          )}
        />
        <Divider orientation="vertical" label="OR" />
        <Flex direction="column" bg="#F3F4F6" pt="sm" pl="sm">
          <Button fullWidth={false} leftIcon={<GridIcon />}>
            Manually enter your data
          </Button>
          <Group>
            <Warning /> <Text>Recommanded upto 1K records.</Text>
          </Group>
          <Box pt="xs" pl="xs">
            <Table>
              <thead>
                <tr>
                  <th>Element position</th>
                  <th>Element name</th>
                  <th>Symbol</th>
                  <th>Atomic mass</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td>
                      <Skeleton animate={false} height={15} radius="md" />
                    </td>
                    <td>
                      <Skeleton animate={false} height={15} radius="md" />
                    </td>
                    <td>
                      <Skeleton animate={false} height={15} radius="md" />
                    </td>
                    <td>
                      <Skeleton animate={false} height={15} radius="md" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Box>
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

      <Footer
        onNextClick={onSubmit}
        onPrevClick={() => {}}
        active={PhasesEnum.UPLOAD}
        primaryButtonLoading={isUploadLoading || isExcelSheetNamesLoading}
      />
    </>
  );
}
