import { createStyles } from '@mantine/core';

const getLabelStyles = (): React.CSSProperties => ({
  paddingLeft: 5,
  cursor: 'pointer',
});

export default createStyles((): Record<string, any> => {
  return {
    label: getLabelStyles(),
  };
});
