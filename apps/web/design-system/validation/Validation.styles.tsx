import { colors } from '@config';
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

interface IParamsProps {
  showWrapper?: boolean;
}

export default createStyles(
  (theme: MantineTheme, params: IParamsProps): Record<string, any> => ({
    label: getLabelStyles(theme),
    description: getDescriptionStyles(theme),
    wrapper: params.showWrapper
      ? {
          padding: theme.spacing.xs,
          backgroundColor: colors.BGPrimaryDark,
        }
      : {},
  })
);
