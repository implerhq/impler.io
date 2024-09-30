import { createStyles, CSSObject } from '@mantine/core';

const getDropzoneInnerStyles = (): CSSObject => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const getRootStyles = (): CSSObject => ({
  flexGrow: 1,
  height: '100%',
  borderRadius: 'var(--border-radius)',
  backgroundColor: `var(--secondary-background)`,
  '&:hover': {
    backgroundColor: `var(--secondary-background-hover)`,
  },
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
