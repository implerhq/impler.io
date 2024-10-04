import { Group, Select, Stack, Text } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import useStyles from './MappingItem.style';
import { ChevronDown, GreenCheck } from '../../icons';

interface IOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface IMappingItem {
  value?: string;
  error?: string;
  heading: string;
  required?: boolean;
  size?: 'sm' | 'md';
  searchable?: boolean;
  mappingDoneText: string;
  mappingPlaceholder: string;
  mappingNotDoneText: string;
  options: IOption[] | string[];
  onChange?: (value: any) => void;
}

export const MappingItem = React.forwardRef<HTMLInputElement, IMappingItem>((props: IMappingItem, ref) => {
  const {
    value,
    error,
    heading,
    options,
    required,
    onChange,
    size = 'xs',
    mappingDoneText,
    mappingPlaceholder,
    searchable = true,
    mappingNotDoneText,
  } = props;
  const defaultGroupHeight = 45;
  const isMapped = value && !error;
  const groupRef = useRef<HTMLDivElement>(null);
  const [groupHeight, setGroupHeight] = useState<number>(defaultGroupHeight);
  const { classes } = useStyles({ height: groupHeight });

  useEffect(() => {
    setGroupHeight(groupRef.current?.getBoundingClientRect().height || defaultGroupHeight);
  }, []);

  return (
    <Group className={classes.root} noWrap>
      <Stack className={classes.selectionWrapper} spacing={0}>
        <Group className={classes.selectionRoot} align="stretch" noWrap>
          <Text size={size} className={classes.heading} ref={groupRef}>
            {heading}
            {required ? <span className={classes.required}>&nbsp;*</span> : null}
          </Text>
          <Select
            placeholder={mappingPlaceholder}
            value={value}
            data={options}
            classNames={{ root: classes.selectRoot, input: classes.select }}
            rightSection={<ChevronDown />}
            clearable
            searchable={searchable}
            dropdownComponent="div"
            onChange={(selectedValue) => onChange && onChange(selectedValue)}
            ref={ref}
          />
        </Group>
        {error ? (
          <Text size="xs" color="var(--error-color)">
            {error}
          </Text>
        ) : null}
      </Stack>
      <Text size={size} color={isMapped ? 'black' : 'gray'} className={classes.statusText}>
        {isMapped ? <GreenCheck /> : null}
        {isMapped ? mappingDoneText : mappingNotDoneText}
      </Text>
    </Group>
  );
});
