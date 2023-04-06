/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';
import { colors } from '@config';
import { ButtonColors, ButtonVariants } from './Button';

const getRootFilledStyles = () => ({
  backgroundColor: colors.blue,
  borderRadius: '0px',
  ['&:hover']: {
    backgroundColor: colors.blueDark,
  },
});

const getRootOutlineStyles = (theme: MantineTheme, color: ButtonColors = 'blue') => ({
  borderRadius: '0px',
  backgroundColor: 'transparent',
  transition: 'color 0.2s, background-color 0.2s, border-color ease-in-out',
  border: `1px solid ${theme.colorScheme === 'dark' ? colors.white : colors.black}`,
  color: theme.colorScheme === 'dark' ? colors.white : colors.black,
  ['&:hover']: {
    backgroundColor: theme.colorScheme === 'light' && color === 'white' ? colors.black : colors[color],
    color: theme.colorScheme === 'dark' && color === 'white' ? colors.black : colors.white,
    border: `1px solid ${color === 'white' ? colors.black : colors[color]}`,
  },
});

interface Params {
  variant?: ButtonVariants;
  color?: ButtonColors;
}

export default createStyles((theme: MantineTheme, params: Params): Record<string, any> => {
  return {
    root: params.variant === 'filled' ? getRootFilledStyles() : getRootOutlineStyles(theme, params.color),
  };
});
