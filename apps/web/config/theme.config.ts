import { MantineTheme, MantineThemeOverride } from '@mantine/core';

export const colors = {
  danger: '#F64747',
  dangerDark: '#d53939',
  success: '#17B551',
  warning: '#F9931F',
  blue: '#5463FF',
  blueDark: '#3D49C9',
  green: '#00B3B6',
  greenDark: '#008489',
  yellow: '#F7B801',
  grey: '#B9BEBD',
  red: '#880808',
  darkGrey: '#454545',
  darkBlue: '#5263FA',
  lightGrey: '#333333',

  BGPrimaryDark: '#111111',
  BGPrimaryLight: '#F3F3F3',

  BGSecondaryDark: '#1D1E22',
  BGSecondaryLight: '#FFFFFF',

  BGTertiaryDark: '#24262B',
  BGTertiaryLight: '#F9F9F9',

  TXTDark: '#FFFFFF',
  TXTLight: '#000000',
  TXTGray: '#E4E4E4',
  TXTSecondaryDark: '#888888',

  StrokeDark: '#52555E',
  StrokeLight: '#CCCCCC',

  StrokeSecondaryLight: '#dee2e6',
  StrokeSecondaryDark: '#707070',

  white: '#FFFFFF',
  black: '#000000',

  DisabledDark: '#52555E',
  DisabledLight: '#CCCCCC',
};

export const shadows = {
  light: '0px 5px 15px rgba(38, 68, 128, 0.05)',
  medium: '0px 5px 15px rgba(122, 133, 153, 0.25)',
  dark: '0px 5px 20px rgba(0, 0, 0, 0.2)',
  color: '0px 5px 20px -5px rgba(233, 52, 94, 0.5)',
};

export const strokes = {
  xs: '1px',
  sm: '2px',
  md: '3px',
  lg: '4px',
  xl: '5px',
};

export const IconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export const mantineConfig: MantineThemeOverride = {
  lineHeight: '17px',
  radius: { md: '7px', xl: '30px' },
  spacing: { xs: '12px', sm: '16px', md: '20px', lg: '24px', xl: '32px' },
  shadows: {
    sm: shadows.light,
    md: shadows.medium,
    lg: shadows.dark,
    xl: shadows.color,
  },
  breakpoints: {
    xs: '0',
    sm: '600',
    md: '960',
    lg: '1280',
    xl: '1920',
  },
  headings: {
    sizes: {
      h1: { fontSize: '2rem', lineHeight: 1.2 },
    },
  },
  components: {
    Input: {
      styles: (theme: MantineTheme) => ({
        input: {
          borderRadius: 0,
          backgroundColor: theme.colorScheme === 'dark' ? colors.BGPrimaryDark : colors.BGPrimaryLight,
        },
      }),
    },
    InputWrapper: {
      styles: () => ({
        label: {
          marginBottom: 5,
        },
      }),
    },
    Checkbox: {
      styles: (theme: MantineTheme) => ({
        input: {
          borderRadius: 0,
          backgroundColor: theme.colorScheme === 'dark' ? colors.BGPrimaryDark : colors.BGPrimaryLight,
        },
      }),
    },
  },
  globalStyles: (theme) => ({
    '*': {
      boxSizing: 'border-box',
      padding: 0,
      margin: 0,
    },
    html: {
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      WebkitTapHighlightColor: 'transparent',
      WebkitTextSizeAdjust: '100%',
      WebkitOverflowScrolling: 'touch',
      textRendering: 'optimizeLegibility',
      lineHeight: theme.lineHeight,
    },
    body: {
      backgroundColor: theme.colorScheme === 'dark' ? colors.BGPrimaryDark : colors.BGPrimaryLight,
      color: theme.colorScheme === 'dark' ? colors.TXTDark : colors.TXTLight,
      fontSize: '16px',
    },
    a: {
      color: theme.colorScheme === 'dark' ? colors.blueDark : colors.blue,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  }),
};
