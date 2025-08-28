import { createStyles } from '@mantine/core';
import { colors, strokes } from '@config';

const getRootStyles = () => ({
  borderRadius: 0,
  borderWidth: strokes.sm,
  borderStyle: 'solid',
  borderColor: colors.white,
  padding: 0,
  height: '100%',
  '.mantine-SegmentedControl-indicator': {
    transform: 'none',
    borderRadius: 0,
    border: 0,
    height: '100%',
    backgroundColor: 'transparent',
  },
  '.mantine-SegmentedControl-control': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const getActiveStyles = () => ({
  backgroundColor: colors.blue,
});

const getActiveLabelStyles = () => ({
  borderRadius: '0px',
  color: colors.white + ' !important',
  backgroundColor: colors.blue,
});
const getLabelStyles = () => ({
  color: colors.white,
  '&:hover': {
    color: colors.white,
  },
});

export default createStyles((): Record<string, any> => {
  return {
    root: getRootStyles(),
    active: getActiveStyles(),
    label: getLabelStyles(),
    controlActive: getActiveLabelStyles(),
  };
});
