import { ReviewDataTypesEnum } from '@impler/shared';
import { SegmentedControl as MantineSegmentedControl, SegmentedControlItem, Stack, Text } from '@mantine/core';

import useStyles from './SegmentedControl.styles';

interface SegmentedControlProps {
  value?: string;
  label?: string;
  items: SegmentedControlItem[];
  onChange?: (value: ReviewDataTypesEnum) => void;
}

export function SegmentedControl({ onChange, value, items, label }: SegmentedControlProps) {
  const { classes } = useStyles();

  const control = (
    <MantineSegmentedControl data={items} radius="xl" value={value} onChange={onChange} classNames={classes} />
  );

  return label ? (
    <Stack spacing={3}>
      <Text size="sm" fw="bold">
        {label}
      </Text>
      {control}
    </Stack>
  ) : (
    control
  );
}
