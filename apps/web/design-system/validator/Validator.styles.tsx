import { createStyles, CSSObject, getSize, MantineTheme } from '@mantine/core';

const getLabelStyles = (theme: MantineTheme): CSSObject => ({
  ...theme.fn.fontStyles(),
  fontWeight: 500,
  fontSize: getSize({ size: 'sm', sizes: theme.fontSizes }),
  color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9],
});
const getDescriptionStyles = (theme: MantineTheme): CSSObject => ({
  fontSize: '0.75rem',
  color: theme.colors.gray[6],
});

export default createStyles(
  (theme: MantineTheme): Record<string, any> => ({
    label: getLabelStyles(theme),
    description: getDescriptionStyles(theme),
  })
);
