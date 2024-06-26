import { CrossIcon } from '@icons';
import { Indicator, Image } from '@mantine/core';
import { colors } from 'config/colors.config';
import useStyles from './ImageWithIndicator.styles';

interface ImageWithIndicatorProps {
  src: string;
}
export function ImageWithIndicator({ src }: ImageWithIndicatorProps) {
  const { classes } = useStyles();

  return (
    <Indicator p={0} withBorder tabIndex={0} label={<CrossIcon />} color={colors.danger} classNames={classes}>
      <Image src={src} radius="md" width={100} height={100} />
    </Indicator>
  );
}
