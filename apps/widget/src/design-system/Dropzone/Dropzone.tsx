import { Group, Text } from '@mantine/core';
import { Dropzone as MantineDropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import useStyles from './Dropzone.style';
import { TEXTS } from '../../config/texts.config';
import { FileIcon } from '../../icons';

interface IDropzoneProps {
  loading?: boolean;
  accept?: string[];
  onDrop: (files: FileWithPath[]) => void;
}

export function Dropzone(props: IDropzoneProps) {
  const { loading, accept = [MIME_TYPES.csv, MIME_TYPES.xls, MIME_TYPES.xlsx], onDrop } = props;
  const { classes } = useStyles();

  return (
    <MantineDropzone onDrop={onDrop} accept={accept} loading={loading} classNames={classes} multiple={false}>
      <Group position="center" style={{ pointerEvents: 'none' }}>
        <div>
          <Text size="xl" align="center">
            {TEXTS.DROPZONE.TITLE}
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
}
