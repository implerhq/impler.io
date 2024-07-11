import { colors } from '@config';
import { Tooltip, Badge } from '@mantine/core';
const parseCronExpression = require('util/helpers/cronstrue');

interface TooltipBadgesProps {
  badges: string[];
  onBadgeClick: (cronExpression: string) => void;
}

export function TooltipBadges({ badges, onBadgeClick }: TooltipBadgesProps) {
  return (
    <>
      {badges.map((badgeInfo, index) => (
        <Tooltip key={index} label={parseCronExpression.toString(badgeInfo)} withArrow>
          <Badge
            onClick={() => onBadgeClick(badgeInfo)}
            size="xl"
            style={{
              color: 'white',
              cursor: 'pointer',
              backgroundColor: colors.lightBlue,
            }}
          >
            {badgeInfo}
          </Badge>
        </Tooltip>
      ))}
    </>
  );
}
