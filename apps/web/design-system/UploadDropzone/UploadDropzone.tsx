import { Flex, Stack, Text } from '@mantine/core';
import { Dropzone as MantineDropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';

import { WIDGET_TEXTS } from '@impler/client';
import useStyles from './UploadDropzone.styles';
import { Button } from '@ui/button';

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
    accept = [MIME_TYPES.csv, MIME_TYPES.xlsx, 'application/vnd.ms-excel.sheet.macroenabled.12'],
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
        <Stack spacing="sm" align="center" content="center">
          <Text align="center" weight="bold">
            {texts.FILE_DROP_AREA.ONBOARD_DROP_FILE}
          </Text>
          <Text size="sm" align="center">
            {texts.FILE_DROP_AREA.ONBOARD_FILE_FORMATS}
          </Text>

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
