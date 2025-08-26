/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';
import { colors } from '@config';
import { ButtonColors, ButtonVariants } from './Button';

const colorsCodes: Record<ButtonColors, string> = {
  blue: colors.blue,
  red: colors.danger,
  green: colors.green,
  invariant: colors.black,
  yellow: colors.yellow,
  grey: colors.StrokeLight,
};

const getRootFilledStyles = (theme: MantineTheme, color: ButtonColors = 'blue', fullWidth?: boolean) => ({
  ...(color === 'blue' && {
    backgroundColor: colors.blue,
    color: colors.white,
  }),
  ...(color === 'invariant' && {
    backgroundColor: colors.white,
    color: colors.black,
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
      backgroundColor: colors.white,
      color: colors.black,
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

const getRootOutlineStyles = (
  theme: MantineTheme,
  color: ButtonColors = 'blue',
  fullWidth?: boolean,
  borderLess?: boolean
) => ({
  borderRadius: '0px',
  backgroundColor: 'transparent',
  width: fullWidth ? '100%' : 'max-content',
  transition: 'color 0.2s, background-color 0.2s, border-color ease-in-out',
  border: borderLess
    ? `1px solid transparent`
    : `1px solid ${color === 'invariant' ? colors.StrokeDark : colorsCodes[color]}`,
  color: color === 'invariant' ? colors.white : colorsCodes[color],
  '> svg': {
    color: color === 'invariant' ? colors.white : colorsCodes[color],
  },
  ['&:hover']: {
    ...(color === 'blue' && {
      backgroundColor: colors.blue,
      color: colors.white,
      border: `1px solid ${colors.blue}`,
    }),
    ...(color === 'invariant' && {
      backgroundColor: colors.white,
      color: colors.black,
      border: `1px solid ${colors.black}`,
      '> svg': {
        color: colors.black,
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
    ...(color === 'yellow' && {
      backgroundColor: colors.yellow,
      color: colors.white,
      border: `1px solid ${colors.yellow}`,
    }),
    ...(color === 'grey' && {
      backgroundColor: colors.lightGrey,
      color: colors.white,
      border: `1px solid ${colors.lightGrey}`,
      '> svg': {
        color: colors.black,
      },
    }),
    color: color === 'invariant' ? colors.black : colors.white,
  },
});

interface Params {
  variant?: ButtonVariants;
  color?: ButtonColors;
  fullWidth?: boolean;
  borderLess?: boolean;
}

export default createStyles((theme: MantineTheme, params: Params): Record<string, any> => {
  return {
    root:
      params.variant === 'filled'
        ? getRootFilledStyles(theme, params.color, params.fullWidth)
        : getRootOutlineStyles(theme, params.color, params.fullWidth, params.borderLess),
  };
});
