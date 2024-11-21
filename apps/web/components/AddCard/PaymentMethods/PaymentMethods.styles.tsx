import { colors } from '@config';
import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  radio: {
    '& .mantine-Radio-radio': {
      border: `2px solid ${colors.blue}`,
      backgroundColor: 'transparent',

      '&:checked': {
        backgroundColor: colors.blue,
        border: theme.colors.blue,
      },
    },
  },
}));
