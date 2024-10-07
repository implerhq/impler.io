import { createStyles, MantineTheme } from '@mantine/core';

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    table: {
      overflow: 'auto',
      borderSpacing: 0,
      borderCollapse: 'separate',
      borderRadius: 'var(--border-radius)',
    },
    row: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#DFE2FF',
      },
    },
    selectedRow: {
      backgroundColor: '#DFE2FF',
      fontWeight: 700, // Bold font weight for selected row
      '&:hover': {
        backgroundColor: '#DFE2FF',
      },
    },
    aboveSelectedRow: {
      backgroundColor: '#F3F4F6',
      color: 'var(--label-color)',
      fontWeight: 300, // Lighter font weight for rows above selected
    },
    cell: {
      textWrap: 'nowrap',
      border: `1px solid ${theme.colors.gray[3]}`,
      padding: theme.spacing.xs,
      backgroundColor: 'transparent',
    },
    radioCell: {
      width: '40px',
      textAlign: 'center',
    },
  };
});
