import { FileIcon, CrossIcon } from '../../icons';
import { Group, Text } from '@mantine/core';
import useStyles from './File.style';
import { colors } from '../../config/colors.config';
import { formatBytes } from '../../util/helpers/common.helpers';
import { variables } from '@config';

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
        <Group spacing={0} noWrap>
          <Text size="sm" color="primary" inline className={classes.nameText}>
            {name.split('.')[variables.baseIndex]}
          </Text>
          <Text size="sm" color="primary" inline className={classes.extensionText}>
            .{name.split('.').pop()}
          </Text>
        </Group>
      </Group>
      <Group spacing="xs">
        <Text size="sm" color="secondary" inline className={classes.sizeText}>
          {formatBytes(size)}
        </Text>
        <CrossIcon className={classes.crossIcon} onClick={onClearClick} />
      </Group>
    </Group>
  );
}
