import { colors } from '@config';
import { createStyles } from '@mantine/core';

export default createStyles(() => ({
  root: {
    backgroundColor: colors.lightRed,
    border: `1px solid ${colors.danger}`,
    borderRadius: '0px',
    padding: '8px 16px',
    maxWidth: '35%',
    marginTop: '20px',
  },
  message: {
    color: colors.danger,
    fontSize: '14px',
  },
  icon: {
    color: colors.danger,
    marginRight: '8px',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
}));
