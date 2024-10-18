import { colors } from '@config';
import { createStyles } from '@mantine/core';

interface PlanDetailCardStylesParams {
  isWarning: boolean;
}

export const usePlanDetailCardStyles = createStyles((theme, { isWarning }: PlanDetailCardStylesParams) => ({
  container: {
    border: `1px solid ${isWarning ? 'red' : 'rgba(255, 198, 77, 0.9)'}`,
    borderRadius: '8px',
    background: isWarning ? 'rgba(255, 0, 0, 0.2)' : 'rgba(51, 42, 25, 0.7)',
    backdropFilter: 'blur(8px)',
    minWidth: '250px',
    padding: theme.spacing.lg,
  },
  title: {
    color: colors.StrokeLight,
    marginBottom: theme.spacing.xs,
    fontSize: theme.fontSizes.sm,
  },
  value: {
    color: colors.white,
  },
  warningValue: {
    color: colors.danger,
  },
}));
