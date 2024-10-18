import { colors } from '@config';
import { Tooltip, Badge } from '@mantine/core';
interface TooltipBadgeProps {
  badge: string;
  tooltipLabel: string;
  onBadgeClick: (cronExpression: string) => void;
}

export function TooltipBadge({ badge, tooltipLabel, onBadgeClick }: TooltipBadgeProps) {
  return (
    <Tooltip label={tooltipLabel} withArrow>
      <Badge
        onClick={() => onBadgeClick(badge)}
        size="xl"
        style={{
          color: 'white',
          cursor: 'pointer',
          backgroundColor: colors.lightBlue,
        }}
      >
        {badge}
      </Badge>
    </Tooltip>
  );
}
