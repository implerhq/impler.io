import { colors } from '@config';
import { createStyles } from '@mantine/core';

const getModalStyles = (): React.CSSProperties => ({
  backgroundColor: colors.BGPrimaryDark,
});

const getTitleStyles = (): React.CSSProperties => ({
  color: colors.white,
});

export default createStyles((): Record<string, any> => {
  return {
    modal: getModalStyles(),
    title: getTitleStyles(),
  };
});
