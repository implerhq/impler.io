import { FileIcon, CrossIcon } from '../../icons';
import { Group, Text } from '@mantine/core';
import useStyles from './File.style';
import { colors } from '../../config/colors.config';
import { formatBytes } from '../../util/helpers/common.helpers';

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
      <Group spacing="xs">
        <FileIcon className={classes.fileIcon} fill={colors.darkDeem} />
        <Text size="sm" inline className={classes.nameText}>
          {name}
        </Text>
      </Group>
      <Group spacing="xs">
        <Text size="sm" inline className={classes.sizeText}>
          {formatBytes(size)}
        </Text>
        <CrossIcon className={classes.crossIcon} onClick={onClearClick} />
      </Group>
    </Group>
  );
}
