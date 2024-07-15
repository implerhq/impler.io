import { createStyles } from '@mantine/core';

const getLabelStyles = (): React.CSSProperties => ({
  cursor: 'pointer',
});

export default createStyles((): Record<string, any> => {
  return {
    label: getLabelStyles(),
  };
});
