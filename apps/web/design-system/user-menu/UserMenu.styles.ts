/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';
import { colors } from '@config';

const getAvatarStyles = (theme: MantineTheme) => ({
  borderRadius: '0px',
  border: `1px solid ${theme.colorScheme === 'dark' ? colors.white : colors.black}`,
});

const getNameStyles = (theme: MantineTheme): React.CSSProperties => ({
  color: theme.colorScheme === 'dark' ? colors.white : colors.black,
  fontWeight: 500,
});

const getDropdownStyles = (theme: MantineTheme): React.CSSProperties => ({
  width: '100%',
  padding: 10,
  minWidth: 150,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    avatar: getAvatarStyles(theme),
    name: getNameStyles(theme),
    dropdown: getDropdownStyles(theme),
  };
});
