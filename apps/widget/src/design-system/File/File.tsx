import { FileIcon, CrossIcon } from '../../icons';
import { Group, Text } from '@mantine/core';
import { FileWithPath } from '@mantine/dropzone';
import useStyles from './File.style';

interface IFile extends FileWithPath {
  onClose?: () => void;
}

export function File(props: IFile) {
  const { onClose, name, size } = props;
  const { classes } = useStyles();

  const onCloseClick = (e: MouseEvent) => {
    e.preventDefault();
    if (onClose) {
      onClose();
    }
  };

  return (
    <Group className={classes.root}>
      <Group spacing="sm">
        <FileIcon className={classes.fileIcon} />
        <Text size="sm" inline className={classes.nameText}>
          {name}
        </Text>
      </Group>
      <Group spacing="sm">
        <Text size="sm" inline className={classes.sizeText}>
          {size}
        </Text>
        <CrossIcon className={classes.crossIcon} onClick={onCloseClick} />
      </Group>
    </Group>
  );
}
