import { MantineThemeOverride } from '@mantine/core';

export const spacings = { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 };

export const mantineConfig: MantineThemeOverride = {
  fontFamily: "'Lato', sans serif",
  headings: {
    fontFamily: "'Lato', sans serif",
    sizes: {
      h1: { fontSize: 26 },
      h2: { fontSize: 20 },
    },
  },
};
