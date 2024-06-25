import { Group, Text } from '@mantine/core';
import { Dropzone as MantineDropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import { ImageIcon } from '../../icons';
import useStyles from './FileDropdown.styles';
import { TEXTS } from '../../config/texts.config';

interface IDropzoneProps {
  loading?: boolean;
  accept?: string[];
  onReject?: () => void;
  onDrop: (files: FileWithPath[]) => void;
  title?: string;
}

export function FileDropzone(props: IDropzoneProps) {
  const { loading, accept = [MIME_TYPES.png, MIME_TYPES.jpeg], onDrop, onReject, title } = props;
  const { classes } = useStyles();

  const SelectFileContent = () => {
    return (
      <MantineDropzone onReject={onReject} onDrop={onDrop} accept={accept} loading={loading} classNames={classes}>
        <Group position="center">
          <div>
            <MantineDropzone.Idle>
              <Group position="center" p="xs">
                <ImageIcon />
              </Group>
            </MantineDropzone.Idle>
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
    </div>
  );
}
