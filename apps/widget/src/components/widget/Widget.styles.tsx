import { createStyles, MantineTheme } from '@mantine/core';

const getTitleStyles = (theme: MantineTheme) => ({
  display: 'block',
  [`@media (max-width: ${theme.spacing.md}px)`]: {
    display: 'none',
  },
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    title: getTitleStyles(theme),
  };
});
