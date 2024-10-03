import { createStyles } from '@mantine/core';

export const getRootStyles = (): React.CSSProperties => ({
  flexGrow: 1,
});

export default createStyles((): Record<string, any> => {
  return {
    root: getRootStyles(),
  };
});
