import { colors } from '@config';
import { createStyles } from '@mantine/core';

interface PlanDetailCardStylesParams {
  isWarning: boolean;
}

export const usePlanDetailCardStyles = createStyles((theme, { isWarning }: PlanDetailCardStylesParams) => ({
  container: {
    border: `1px solid ${isWarning ? 'red' : 'rgba(255, 198, 77, 0.9)'}`,
    borderRadius: '8px',
    background: isWarning ? colors.lightRed : colors.faintYellow,
    padding: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.xs,
    fontSize: theme.fontSizes.sm,
  },
  value: {
    color: colors.StrokeLight,
  },
  warningValue: {
    color: colors.danger,
  },
}));
