import { colors } from '@config';
import { CSSObject, createStyles } from '@mantine/core';

export default createStyles((): Record<string, CSSObject> => {
  return {
    container: {
      backgroundColor: colors.BGSecondaryDark,
      border: `1px solid ${colors.StrokeDark}`,
    },
  };
});
