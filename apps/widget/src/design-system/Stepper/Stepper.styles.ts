import { createStyles } from '@mantine/core';
import { colors } from '../../config/colors.config';

export const getSeparatorStyles = () => ({
  backgroundColor: 'none',
  flex: 0,
  marginLeft: 7,
  marginRight: 7,
});

export const getStepLabelStyles = () => ({
  color: colors.darkDeem,
  fontWeight: 600,
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
    stepLabel: getStepLabelStyles(),
  };
});
