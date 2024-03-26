import { colors } from '@config';
import { MantineTheme, createStyles } from '@mantine/core';

interface ParamProps {
  hasError?: boolean;
}

export default createStyles((theme: MantineTheme, params: ParamProps): Record<string, any> => {
  let borderColor = theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4];
  if (params.hasError) borderColor = theme.colors.red[8];

  return {
    wrapper: {
      display: 'flex',
      gap: theme.spacing.xs,
      border: `0.0625rem solid ${borderColor}`,
      '&:focus-within': {
        borderColor,
      },
      backgroundColor: colors.BGPrimaryDark,
    },
    rightSection: {
      padding: '0 10px',
      width: 'unset',
      position: 'unset',
      textWrap: 'nowrap',
      backgroundColor: colors.BGSecondaryDark,
      borderLeft: `0.0625rem solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4]}`,
    },
    input: {
      padding: '10px 0px 10px 15px',
      position: 'unset',
      border: 'none',
    },
  };
});
