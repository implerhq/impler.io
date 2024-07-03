import { ReviewDataTypesEnum } from '@impler/shared';
import { SegmentedControl as MantineSegmentedControl } from '@mantine/core';

import useStyles from './SegmentedControl.styles';

interface SegmentedControlProps {
  value: string;
  allDataLength?: string;
  validDataLength?: string;
  invalidDataLength?: string;
  onChange: (value: ReviewDataTypesEnum) => void;
}

export function SegmentedControl({
  onChange,
  value,
  allDataLength = '',
  validDataLength = '',
  invalidDataLength = '',
}: SegmentedControlProps) {
  const { classes } = useStyles();

  return (
    <MantineSegmentedControl
      data={[
        { value: 'all', label: `All ${allDataLength}` },
        { value: 'valid', label: `Valid ${validDataLength}` },
        { value: 'invalid', label: `Invalid ${invalidDataLength}` },
      ]}
      radius="xl"
      value={value}
      onChange={onChange}
      classNames={classes}
    />
  );
}
