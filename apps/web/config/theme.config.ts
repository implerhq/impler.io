import { MantineThemeOverride } from '@mantine/core';

export const colors = {
  danger: '#F64747',
  success: '#17B551',
  warning: '#F9931F',
  blue: '#5463FF',
  blueDark: '#3D49C9',
  green: '#00B3B6',
  yellow: '#F7B801',

  BGPrimaryDark: '#111111',
  BGPrimaryLight: '#F3F3F3',

  BGSecondaryDark: '#1D1E22',
  BGSecondaryLight: '#FFFFFF',

  BGTertiaryDark: '#24262B',
  BGTertiaryLight: '#F9F9F9',

  TXTDark: '#FFFFFF',
  TXTLight: '#000000',

  TXTSecondaryDark: '#888888',

  StrokeDark: '#52555E',
  StrokeLight: '#CCCCCC',

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
  radius: { md: 7, xl: 30 },
  spacing: { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 },
  shadows: {
    sm: shadows.light,
    md: shadows.medium,
    lg: shadows.dark,
    xl: shadows.color,
  },
};
