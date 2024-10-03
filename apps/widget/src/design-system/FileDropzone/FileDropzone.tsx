import { Stack, Text } from '@mantine/core';
import { Dropzone as MantineDropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import { Button } from '@ui/Button';
import { variables } from '../../config';
import { WIDGET_TEXTS } from '@impler/client';
import useStyles from './FileDropdown.styles';

interface IDropzoneProps {
  loading?: boolean;
  accept?: string[];
  onReject?: () => void;
  onDrop: (files: FileWithPath[]) => void;
  title?: string;
  error?: string;
  texts: typeof WIDGET_TEXTS;
}

export function FileDropzone(props: IDropzoneProps) {
  const {
    title,
    error,
    onDrop,
    loading,
    onReject,
    accept = [MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.webp],
    texts,
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
        <Stack spacing={0} align="center" content="center">
          <Text align="center" weight="bold">
            {texts.FILE_DROP_AREA.DROP_FILE}
          </Text>
          <Text align="center">{texts.FILE_DROP_AREA.FILE_FORMATS}</Text>
          <MantineDropzone.Idle>
            <Button>{texts.FILE_DROP_AREA.CHOOSE_FILE}</Button>
          </MantineDropzone.Idle>
          <Text size="xs" align="center">
            {texts.FILE_DROP_AREA.IMAGE_FILE_SIZE}
          </Text>
        </Stack>
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
