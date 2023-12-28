import { createStyles } from '@mantine/core';

const getWrapperStyles = (): React.CSSProperties => ({
  alignItems: 'center',
});

export default createStyles((): Record<string, any> => {
  return {
    wrapper: getWrapperStyles(),
  };
});
