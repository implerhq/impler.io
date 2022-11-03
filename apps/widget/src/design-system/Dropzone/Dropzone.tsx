import { Group, Text } from '@mantine/core';
import { Dropzone as MantineDropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import useStyles from './Dropzone.style';
import { TEXTS } from '../../config/texts.config';
import { colors } from '../../config/colors.config';
import { FileIcon, CheckIcon } from '../../icons';
import { File as FileCMP } from '../File';

interface IDropzoneProps {
  loading?: boolean;
  accept?: string[];
  onDrop: (files: FileWithPath[]) => void;
  onClear?: () => void;
  file?: FileWithPath;
  title?: string;
}

export function Dropzone(props: IDropzoneProps) {
  const { loading, accept = [MIME_TYPES.csv, MIME_TYPES.xls, MIME_TYPES.xlsx], onDrop, onClear, file, title } = props;
  const { classes } = useStyles();

  const isFileSelected = !!(file && file.name && file.size);

  const SelectedFileContent = () => {
    return (
      <div className={classes.successRoot}>
        <Group position="center">
          <div>
            <Group position="center" mb="sm">
              <CheckIcon className={classes.checkIcon} />
            </Group>
            <Text size="xl" mb="sm" align="center">
              {TEXTS.DROPZONE.FILE_SELECTION}
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
      <MantineDropzone onDrop={onDrop} accept={accept} loading={loading} classNames={classes}>
        <Group position="center">
          <div>
            <Text align="center" weight="bold">
              {TEXTS.DROPZONE.TITLE}{' '}
              <Text component="span" color={colors.primary}>
                {TEXTS.DROPZONE.BROWSE}
              </Text>
            </Text>
            <MantineDropzone.Idle>
              <Group position="center" mt="md">
                <FileIcon className={classes.icon} />
              </Group>
            </MantineDropzone.Idle>
            <Text color="dimmed" size="sm" mt="md" align="center">
              {TEXTS.DROPZONE.SUBTITLE}
            </Text>
          </div>
        </Group>
      </MantineDropzone>
    );
  };

  return (
    <div className={classes.wrapper}>
      {title ? (
        <Text weight="bold" size="sm" color="">
          {title}
        </Text>
      ) : null}
      {isFileSelected ? <SelectedFileContent /> : <SelectFileContent />}
    </div>
  );
}
