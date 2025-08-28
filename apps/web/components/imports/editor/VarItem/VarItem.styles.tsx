import { colors } from '@config';
import { createStyles } from '@mantine/core';

const getRootStyles = (): React.CSSProperties => ({
  padding: 10,
  width: '100%',
  borderRadius: 7,
  marginBottom: 10,
  color: colors.TXTSecondaryDark,
  backgroundColor: colors.BGPrimaryDark,

  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

export default createStyles((): Record<string, any> => {
  return {
    root: getRootStyles(),
  };
});
