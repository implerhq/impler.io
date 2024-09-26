import { Group, Stack, Text } from '@mantine/core';
import { Dropzone as MantineDropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import { colors } from '@config';
import { CheckIcon } from '../../icons';
import { File as FileCMP } from '../File';
import { WIDGET_TEXTS } from '@impler/client';
import useStyles from './UploadDropzone.styles';
import { Button } from '@ui/Button';

interface IDropzoneProps {
  loading?: boolean;
  accept?: string[];
  onReject?: () => void;
  onDrop: (files: FileWithPath[]) => void;
  onClear?: () => void;
  file?: FileWithPath;
  error?: string;
  className?: string;
  texts: typeof WIDGET_TEXTS;
}

export function UploadDropzone(props: IDropzoneProps) {
  const {
    loading,
    accept = [MIME_TYPES.csv, MIME_TYPES.xlsx, 'application/vnd.ms-excel.sheet.macroenabled.12'],
    onDrop,
    onClear,
    file,
    onReject,
    className,
    error,
    texts,
  } = props;
  const { classes } = useStyles({ hasError: !!error });

  const isFileSelected = !!(file && file.name && file.size);

  const SelectedFileContent = () => {
    return (
      <div className={classes.successRoot}>
        <Group position="center">
          <div>
            <Group position="center" mb="sm">
              <CheckIcon className={classes.checkIcon} />
            </Group>
            <Text size="lg" mb="sm" align="center">
              {texts.FILE_DROP_AREA.FILE_SELECTED}
            </Text>
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            <FileCMP name={file!.name} size={file!.size} onClear={onClear} />
          </div>
        </Group>
      </div>
    );
  };

  const SelectFileContent = () => {
    return (
      <MantineDropzone onReject={onReject} onDrop={onDrop} accept={accept} loading={loading} classNames={classes}>
        <Stack spacing={0} align="center">
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
    <div className={className}>
      {isFileSelected ? <SelectedFileContent /> : <SelectFileContent />}
      {error ? (
        <Text size="sm" mt={3} color={colors.red}>
          {error}
        </Text>
      ) : null}
    </div>
  );
}
