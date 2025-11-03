import { Text } from '@mantine/core';

interface MetricItemProps {
  label: string;
  value: string | number;
  actionText?: string;
  actionColor?: string;
  onActionClick?: () => void;
}

export function MetricItem({ label, value, actionText, actionColor, onActionClick }: MetricItemProps) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <Text size="xs" color="dimmed" style={{ marginBottom: 4 }}>
        {label}
      </Text>
      <Text size="xl" weight={700} style={{ marginBottom: 4 }}>
        {value}
      </Text>
      {actionText && (
        <Text
          size="xs"
          weight={500}
          style={{
            color: actionColor || '#fbbf24',
            cursor: onActionClick ? 'pointer' : 'default',
          }}
          onClick={onActionClick}
        >
          {actionText}
        </Text>
      )}
    </div>
  );
}
