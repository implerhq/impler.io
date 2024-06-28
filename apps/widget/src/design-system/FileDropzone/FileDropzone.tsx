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
  const { loading, accept = [MIME_TYPES.png, MIME_TYPES.jpeg], onDrop, onReject, title, error } = props;
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
        <Group position="center">
          <div>
            <Group position="center" p="xs">
              <ImageIcon />
            </Group>
            <Text align="center">
              {TEXTS.DROPZONE.TITLE}{' '}
              <Text component="span" className={classes.browseText}>
                {TEXTS.DROPZONE.BROWSE}
              </Text>
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
      <SelectFileContent />
      {error ? (
        <Text size="xs" mt={3} color="red">
          {error}
        </Text>
      ) : null}
    </div>
  );
}
