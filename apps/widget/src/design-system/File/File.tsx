import { FileIcon, CrossIcon } from '../../icons';
import { Group, Text } from '@mantine/core';
import useStyles from './File.style';

interface IFile {
  name: string;
  size: number;
  onClear?: () => void;
}

export function File(props: IFile) {
  const { onClear, name, size } = props;
  const { classes } = useStyles();

  const onClearClick = (e: MouseEvent) => {
    e.preventDefault();
    if (onClear) {
      onClear();
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
        <CrossIcon className={classes.crossIcon} onClick={onClearClick} />
      </Group>
    </Group>
  );
}
