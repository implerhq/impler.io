import { Group, Text } from '@mantine/core';
import { Dropzone as MantineDropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import { WIDGET_TEXTS } from '@impler/client';
import useStyles from './UploadDropzone.styles';
import { FileIcon, CheckIcon } from '../../icons';
import { File as FileCMP } from '../File';
import { colors } from '@config';

interface IDropzoneProps {
  loading?: boolean;
  accept?: string[];
  onReject?: () => void;
  onDrop: (files: FileWithPath[]) => void;
  onClear?: () => void;
  file?: FileWithPath;
  title?: string;
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
    title,
    className,
    error,
    texts,
  } = props;
  const { classes } = useStyles({ hasError: !!error });
  const wrapperClasses = [classes.wrapper];
  if (className) wrapperClasses.push(className);

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
        <Group position="center">
          <div>
            <Text align="center" weight="bold">
              {texts.FILE_DROP_AREA.DROP_FILE}{' '}
              <Text component="span" className={classes.browseText}>
                {texts.FILE_DROP_AREA.BROWSE_FILE}
              </Text>
            </Text>
            <MantineDropzone.Idle>
              <Group position="center" mt="md">
                <FileIcon className={classes.icon} />
              </Group>
            </MantineDropzone.Idle>
            <Text color="dimmed" size="sm" mt="md" align="center">
              {texts.FILE_DROP_AREA.BRING_FILE}
            </Text>
          </div>
        </Group>
      </MantineDropzone>
    );
  };

  return (
    <div className={wrapperClasses.join(' ')}>
      {title ? (
        <Text weight="bold" size="sm">
          {title}
        </Text>
      ) : null}
      {isFileSelected ? <SelectedFileContent /> : <SelectFileContent />}
      {error ? (
        <Text size="sm" mt={3} color={colors.red}>
          {error}
        </Text>
      ) : null}
    </div>
  );
}
