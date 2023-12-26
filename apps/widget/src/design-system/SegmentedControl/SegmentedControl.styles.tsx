import { colors } from '../../config/colors.config';
import { createStyles } from '@mantine/core';

export default createStyles(() => {
  return {
    label: {
      marginBottom: 0,
    },
    control: {
      '&:last-of-type .mantine-SegmentedControl-label': {
        color: colors.red,
      },
    },
  };
});
