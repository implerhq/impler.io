import { createStyles, MantineTheme } from '@mantine/core';

export const getControlStyles = (theme: MantineTheme) => ({
  fontSize: theme.fontSizes.sm,
  padding: 0,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    item: getControlStyles(theme),
  };
});
