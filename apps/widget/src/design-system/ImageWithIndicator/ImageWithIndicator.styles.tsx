/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';

export const getIndicatorStyles = (theme: MantineTheme): React.CSSProperties => ({
  paddingLeft: 0,
  paddingRight: 0,
  width: '1.7rem',
  cursor: 'pointer',
  height: '1.7rem !important',
  transform: 'translate(30%, -30%) !important',
});

export const getCaptionStyles = (theme: MantineTheme): React.CSSProperties => ({
  textOverflow: 'ellipsis',
  textWrap: 'nowrap',
  overflow: 'hidden',
  marginTop: 0,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    indicator: getIndicatorStyles(theme),
    caption: getCaptionStyles(theme),
    root: {
      borderRadius: theme.radius.sm,
      boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
    },
  };
});
