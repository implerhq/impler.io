import { colors } from '@config';
import { CSSObject, ColorScheme, createStyles } from '@mantine/core';

interface DestinationItemStylesProps {
  colorScheme: ColorScheme;
}

export default createStyles((_, props: DestinationItemStylesProps): Record<string, CSSObject> => {
  return {
    container: {
      backgroundColor: props.colorScheme === 'dark' ? colors.BGSecondaryDark : colors.BGSecondaryLight,
      border: `1px solid ${props.colorScheme === 'dark' ? colors.StrokeDark : colors.StrokeSecondaryLight}`,
    },
  };
});
