/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';
import { colors } from '@config';
import { ButtonColors, ButtonVariants } from './Button';

const getRootFilledStyles = (theme: MantineTheme, color: ButtonColors = 'blue', fullWidth?: boolean) => ({
  ...(color === 'blue' && {
    backgroundColor: colors.blue,
    color: colors.white,
  }),
  ...(color === 'invariant' && {
    backgroundColor: theme.colorScheme === 'dark' ? colors.white : colors.black,
    color: theme.colorScheme === 'dark' ? colors.black : colors.white,
  }),
  ...(color === 'red' && {
    backgroundColor: colors.danger,
  }),
  ...(color === 'green' && {
    backgroundColor: colors.green,
    color: colors.white,
  }),
  width: fullWidth ? '100%' : 'max-content',
  transition: 'color 0.2s, background-color 0.2s, border-color ease-in-out',
  borderRadius: '0px',
  ['&:hover']: {
    ...(color === 'blue' && {
      backgroundColor: colors.blueDark,
    }),
    ...(color === 'invariant' && {
      backgroundColor: theme.colorScheme === 'dark' ? colors.white : colors.black,
      color: theme.colorScheme === 'dark' ? colors.black : colors.white,
    }),
    ...(color === 'red' && {
      backgroundColor: colors.dangerDark,
      color: colors.white,
    }),
    ...(color === 'green' && {
      backgroundColor: colors.greenDark,
      color: colors.white,
    }),
  },
});

const getRootOutlineStyles = (theme: MantineTheme, color: ButtonColors = 'blue', fullWidth?: boolean) => ({
  borderRadius: '0px',
  backgroundColor: 'transparent',
  width: fullWidth ? '100%' : 'max-content',
  transition: 'color 0.2s, background-color 0.2s, border-color ease-in-out',
  border: `1px solid ${theme.colorScheme === 'dark' ? colors.white : colors.black}`,
  color: theme.colorScheme === 'dark' ? colors.white : colors.black,
  '> svg': {
    color: theme.colorScheme === 'dark' ? colors.white : colors.black,
  },
  ['&:hover']: {
    ...(color === 'blue' && {
      backgroundColor: colors.blue,
      color: colors.white,
      border: `1px solid ${colors.blue}`,
    }),
    ...(color === 'invariant' && {
      backgroundColor: theme.colorScheme === 'dark' ? colors.white : colors.black,
      color: theme.colorScheme === 'dark' ? colors.black : colors.white,
      border: `1px solid ${colors.black}`,
      '> svg': {
        color: theme.colorScheme === 'dark' ? colors.black : colors.white,
      },
    }),
    ...(color === 'red' && {
      backgroundColor: colors.danger,
      color: colors.white,
      border: `1px solid ${colors.danger}`,
    }),
    ...(color === 'green' && {
      backgroundColor: colors.green,
      color: colors.white,
      border: `1px solid ${colors.green}`,
    }),
    color: theme.colorScheme === 'dark' && color === 'invariant' ? colors.black : colors.white,
  },
});

interface Params {
  variant?: ButtonVariants;
  color?: ButtonColors;
  fullWidth?: boolean;
}

export default createStyles((theme: MantineTheme, params: Params): Record<string, any> => {
  return {
    root:
      params.variant === 'filled'
        ? getRootFilledStyles(theme, params.color, params.fullWidth)
        : getRootOutlineStyles(theme, params.color, params.fullWidth),
  };
});
