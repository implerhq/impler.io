import { MantineThemeOverride } from '@mantine/core';

export const spacings = { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 };

export const mantineConfig: MantineThemeOverride = {
  fontFamily: "'Poppins', sans serif",
  headings: {
    fontFamily: "'Poppins', sans serif",
  },
  breakpoints: {
    xs: 0,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1440,
  },
};
