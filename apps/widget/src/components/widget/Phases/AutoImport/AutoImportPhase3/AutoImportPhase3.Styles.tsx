/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { colors } from '@config';
import { createStyles, MantineTheme, CSSObject } from '@mantine/core';

const getTabStyles = (theme: MantineTheme): CSSObject => ({
  color: colors.StrokeLight,
  fontWeight: 200,
  borderBottomColor: 'transparent',
  fontSize: theme.fontSizes.sm,
  // Hover state
  '&:hover': {
    backgroundColor: colors.softBlue,
    color: colors.lightBlue,
    fontWeight: 300,
  },

  // Active state
  '&[data-active]': {
    color: colors.lightBlue,
    borderBottomColor: colors.lightBlue,
    fontWeight: 600,
  },
});

const getStackStyles = (): CSSObject => ({
  height: '100%',
  justifyContent: 'space-between',
  border: `1px solid ${colors.lightGrey}`,
  borderRadius: '12px',
});

const getNeverEndsLabelStyles = (): CSSObject => ({
  color: colors.StrokeLight,
  fontWeight: 400,
});

export default createStyles((theme: MantineTheme) => ({
  tab: getTabStyles(theme),
  stack: getStackStyles(),
  neverEndsLabel: getNeverEndsLabelStyles(),
}));
