import { createStyles } from '@mantine/core';

const getSeparatorStyles = () => ({
  backgroundColor: 'none',
  flex: 0,
  marginLeft: 7,
  marginRight: 7,
});

export default createStyles((): Record<string, any> => {
  return {
    steps: {
      flexWrap: 'wrap',
    },
    stepBody: {
      marginLeft: '5px',
    },
    separator: getSeparatorStyles(),
  };
});
