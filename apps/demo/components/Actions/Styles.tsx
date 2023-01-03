import { colors } from '@config';
import { createStyles } from '@mantine/core';

export default createStyles((theme, showInvalidRecords: boolean) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // alignItems: 'flex-end',
    gap: theme.spacing.sm,
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      flexDirection: 'row',
    },
  },
  button: {
    height: '38px !important',
    fontSize: '14px !important',
    lineHeight: '0',
    borderRadius: '0  !important',
    fontWeight: 600,
    color: `${colors.white} !important`,
    backgroundColor: `${colors.purple} !important`,
    border: `2px solid ${colors.purple} !important`,
    padding: '5px 15px !important',
    width: 'max-content',
  },
  root: { lineHeight: '0' },
  track: {
    backgroundColor: showInvalidRecords ? `${colors.cyan} !important` : 'transparent !important',
  },
  label: { color: 'white' },
}));
