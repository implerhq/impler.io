import { Flex, Stack, Text } from '@mantine/core';
import { Dropzone as MantineDropzone, FileWithPath /*, MIME_TYPES*/ } from '@mantine/dropzone';

import { Button } from '@ui/Button';
import { WIDGET_TEXTS } from '@impler/client';
import useStyles from './UploadDropzone.styles';
import { FileMimeTypesEnum } from '@impler/shared';

interface IDropzoneProps {
  loading?: boolean;
  accept?: string[];
  onReject?: () => void;
  onDrop: (files: FileWithPath[]) => void;
  error?: string;
  texts: typeof WIDGET_TEXTS;
  className?: string;
}

export function UploadDropzone(props: IDropzoneProps) {
  const {
    loading,
    accept = [
      FileMimeTypesEnum.CSV,
      FileMimeTypesEnum.CSV_ALT,
      FileMimeTypesEnum.CSV_ALT2,
      FileMimeTypesEnum.EXCEL,
      FileMimeTypesEnum.EXCELX,
      FileMimeTypesEnum.EXCELM,
      FileMimeTypesEnum.TEXT_PLAIN,
      '.csv',
    ],
    onDrop,
    onReject,
    error,
    texts,
    className,
  } = props;
  const { classes } = useStyles();

  const SelectFileContent = () => {
    return (
      <MantineDropzone
        onReject={onReject}
        onDrop={onDrop}
        accept={accept}
        loading={loading}
        classNames={{
          inner: classes.inner,
          root: classes.root,
        }}
        {...(error ? { 'data-has-error': true } : {})}
      >
        <Stack spacing={0} align="center" content="center">
          <Text align="center" weight="bold">
            {texts.FILE_DROP_AREA.DROP_FILE}
          </Text>
          <Text align="center">{texts.FILE_DROP_AREA.FILE_FORMATS}</Text>
          <MantineDropzone.Idle>
            <Button>{texts.FILE_DROP_AREA.CHOOSE_FILE}</Button>
          </MantineDropzone.Idle>
        </Stack>
      </MantineDropzone>
    );
  };

  return (
    <Flex direction="column" gap={3} className={className}>
      <SelectFileContent />
      {error ? (
        <Text size="sm" color="var(--error-color)">
          {error}
        </Text>
      ) : null}
    </Flex>
  );
}
