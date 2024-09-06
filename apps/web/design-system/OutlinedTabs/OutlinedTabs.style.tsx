import { colors } from '@config';
import { createStyles } from '@mantine/core';

const getOutlinedTabStyles = () => ({
  padding: '10px 20px',
  borderBottom: '2px solid transparent',
  '&[aria-selected="true"]': {
    color: colors.blue,
    borderBottom: `2px solid ${colors.blue}`,
    borderColor: colors.blue,
  },
});
export default createStyles(() => {
  return {
    tab: getOutlinedTabStyles(),
  };
});
