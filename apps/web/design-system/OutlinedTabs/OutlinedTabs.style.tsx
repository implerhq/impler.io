import { colors } from '@config';
import { createStyles } from '@mantine/core';

const getOutlinedTabStyles = () => ({
  padding: '10px 20px',
  borderBottom: '2px solid transparent',
  transition: 'color 0.3s ease, border-bottom 0.3s ease',
  '&[aria-selected="true"]': {
    color: colors.blue,
    borderBottom: `2px solid ${colors.blue}`,
  },
});

export default createStyles(() => {
  return {
    tab: getOutlinedTabStyles(),
  };
});
