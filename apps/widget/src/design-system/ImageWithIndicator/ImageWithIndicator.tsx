import { CrossIcon } from '@icons';
import { Indicator, Image } from '@mantine/core';
import { colors } from 'config/colors.config';
import useStyles from './ImageWithIndicator.styles';

interface ImageWithIndicatorProps {
  src: string;
  caption?: string;
  onCloseClick?: () => void;
}
export function ImageWithIndicator({ src, caption, onCloseClick }: ImageWithIndicatorProps) {
  const { classes } = useStyles();

  return (
    <Indicator
      p={3}
      withBorder
      tabIndex={0}
      classNames={classes}
      label={<CrossIcon />}
      color={colors.danger}
      onClick={onCloseClick}
    >
      <Image
        caption={caption}
        src={src}
        alt={caption}
        radius="sm"
        width={100}
        height={100}
        classNames={{ caption: classes.caption }}
      />
    </Indicator>
  );
}
