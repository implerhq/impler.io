import { createStyles, CSSObject } from '@mantine/core';
import { colors } from '@config';

export const getContainerStyles = (): React.CSSProperties => ({
  flexDirection: 'column',
  width: '100%',
  alignItems: 'unset',
});

export const getTextContainerStyles = (): React.CSSProperties => ({
  justifyContent: 'space-between',
});

export const getWarningIconStyles = (): React.CSSProperties => ({
  backgroundColor: colors.lightDanger,
  borderRadius: '100%',
  padding: 2,
});
export const getSuccessIconStyles = (): CSSObject => ({
  backgroundColor: colors.lightSuccess,
  borderRadius: '100%',
  padding: 2,
  height: 20,
  color: colors.success,
});

export default createStyles((): Record<string, any> => {
  return {
    container: getContainerStyles(),
    textContainer: getTextContainerStyles(),
    warningIcon: getWarningIconStyles(),
    successIcon: getSuccessIconStyles(),
  };
});
