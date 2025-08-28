import { createStyles, MantineTheme } from '@mantine/core';
import { colors } from '@config';

const getAvatarStyles = (): React.CSSProperties => ({
  borderRadius: '100px',
  border: `1px solid ${colors.white}`,
});

const getNameStyles = (): React.CSSProperties => ({
  color: colors.white,
  fontWeight: 500,
});

const getDropdownStyles = (): React.CSSProperties => ({
  width: '100%',
  padding: 10,
  minWidth: 150,
});

const getUnstyledButtonStyles = (theme: MantineTheme, collapsed?: boolean) => ({
  width: '100%',
  padding: collapsed ? '8px' : '12px',
  display: 'flex',
  justifyContent: collapsed ? 'center' : 'flex-start',
  alignItems: 'center',
  transition: 'background-color 150ms ease',
  '&:hover': {
    backgroundColor: theme.colors.dark[5],
  },
});

export default createStyles((theme: MantineTheme, { collapsed }: { collapsed?: boolean }): Record<string, any> => {
  return {
    avatar: getAvatarStyles(),
    name: getNameStyles(),
    dropdown: getDropdownStyles(),
    button: getUnstyledButtonStyles(theme, collapsed),
  };
});
