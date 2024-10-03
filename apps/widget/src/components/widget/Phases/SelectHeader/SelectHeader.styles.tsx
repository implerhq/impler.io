import { createStyles, MantineTheme } from '@mantine/core';

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    table: {
      borderCollapse: 'separate',
      borderSpacing: 0,
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
      fontWeight: 300, // Lighter font weight for rows above selected
    },
    cell: {
      border: `1px solid ${theme.colors.gray[3]}`,
      padding: theme.spacing.sm,
      backgroundColor: 'transparent',
    },
    radioCell: {
      width: '40px',
      textAlign: 'center',
    },
  };
});
