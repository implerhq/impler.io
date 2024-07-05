import { Group, Text } from '@mantine/core';
import { Dropzone as MantineDropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import { ImageIcon } from '../../icons';
import useStyles from './FileDropdown.styles';
import { TEXTS, variables } from '../../config';

interface IDropzoneProps {
  loading?: boolean;
  accept?: string[];
  onReject?: () => void;
  onDrop: (files: FileWithPath[]) => void;
  title?: string;
  error?: string;
}

export function FileDropzone(props: IDropzoneProps) {
  const {
    title,
    error,
    onDrop,
    loading,
    onReject,
    accept = [MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.webp, MIME_TYPES.svg],
  } = props;
  const { classes } = useStyles();

  const SelectFileContent = () => {
    return (
      <MantineDropzone
        onDrop={onDrop}
        accept={accept}
        loading={loading}
        onReject={onReject}
        classNames={classes}
        maxSize={variables.LIMIT_5_MB} // 5 MB
      >
        <Group position="center" p="xs">
          <ImageIcon />
        </Group>
        <Text align="center">
          {TEXTS.FILE_DROPZONE.TITLE}{' '}
          <Text component="span" className={classes.browseText}>
            {TEXTS.FILE_DROPZONE.BROWSE}
          </Text>
        </Text>
        <Text size="xs" align="center">
          {TEXTS.FILE_DROPZONE.FILE_SIZE}
        </Text>
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
      <SelectFileContent />
      {error ? (
        <Text size="xs" mt={3} color="red">
          {error}
        </Text>
      ) : null}
    </div>
  );
}
