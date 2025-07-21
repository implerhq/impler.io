import { createStyles, MantineTheme } from '@mantine/core';

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    table: {
      overflow: 'auto',
      borderSpacing: 0,
      borderCollapse: 'separate',
      borderRadius: 'var(--border-radius)',

      '& thead th': {
        backgroundColor: 'var(--stepper-background) !important',
        color: 'var(--text-color) !important',
        fontWeight: '600 !important',
        borderBottom: '1px solid var(--border-color) !important',
        padding: '12px !important',
        textAlign: 'left',
      },

      '& tbody td': {
        color: 'var(--text-color) !important',
        backgroundColor: 'var(--background-color) !important',
      },
    },
    row: {
      cursor: 'pointer',
      position: 'relative',
      '&:hover': {
        backgroundColor: 'var(--table-hover-background) !important',
      },
    },
    selectedRow: {
      backgroundColor: `${theme.fn.rgba(theme.colors.primary[5], 0.1)} !important`,
      fontWeight: 700,

      '&:hover': {
        backgroundColor: `${theme.fn.rgba(theme.colors.primary[5], 0.15)} !important`,
      },

      '& td': {
        backgroundColor: 'transparent !important',
      },
    },
    aboveSelectedRow: {
      backgroundColor: 'var(--stepper-background) !important',
      color: 'var(--label-color) !important',
      fontWeight: 300,
    },
    cell: {
      textWrap: 'nowrap',
      border: '1px solid var(--border-color) !important',
      padding: theme.spacing.xs,
      backgroundColor: 'transparent',
      color: 'var(--text-color) !important',
      position: 'relative',
    },
    radioCell: {
      width: '40px',
      textAlign: 'center',
    },

    tableContainer: {
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px',
        backgroundColor: 'var(--button-primary-background)',
        borderRadius: '0 0 var(--border-radius) var(--border-radius)',
      },
    },
  };
});
