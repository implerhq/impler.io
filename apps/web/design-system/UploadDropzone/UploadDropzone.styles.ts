import { createStyles, CSSObject } from '@mantine/core';

const getDropzoneInnerStyles = (): CSSObject => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
});

const getRootStyles = (): CSSObject => ({
  backgroundColor: 'transparent',
  flexGrow: 1,
  height: '100%',
  '&[data-has-error]': {
    borderColor: `var(--error-color)`,
  },
});

export default createStyles((): Record<string, any> => {
  return {
    root: getRootStyles(),
    inner: getDropzoneInnerStyles(),
  };
});
