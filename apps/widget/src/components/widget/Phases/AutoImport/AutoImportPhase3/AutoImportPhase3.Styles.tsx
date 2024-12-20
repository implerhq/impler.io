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

const getStackStyles = (theme: MantineTheme): CSSObject => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: 'auto',
  width: '50%',
  border: `1px solid ${colors.lightGrey}`,
  borderRadius: theme.radius.md,
});

const getNeverEndsLabelStyles = (): CSSObject => ({
  color: colors.StrokeLight,
  fontWeight: 400,
});

export default createStyles((theme: MantineTheme) => ({
  tab: getTabStyles(theme),
  stack: getStackStyles(theme),
  neverEndsLabel: getNeverEndsLabelStyles(),
}));
