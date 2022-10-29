import { MantineThemeOverride } from '@mantine/core';

export const mantineConfig: MantineThemeOverride = {
  fontFamily: 'Lato, sans serif',
  fontSizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 18 },
  radius: { md: 7, xl: 30 },
  // lineHeight: '17px',
  headings: {
    fontFamily: 'Lato, sans-serif',
    sizes: {
      h1: { fontSize: 26 },
      h2: { fontSize: 20 },
    },
  },
};
