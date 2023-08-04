import { Group, Select, Text } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import useStyles from './MappingItem.style';
import { ChevronDown, GreenCheck } from '../../icons';

interface IOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface IMappingItem {
  heading: string;
  required?: boolean;
  options: IOption[] | string[];
  value?: string;
  placeholder?: string;
  size?: 'sm' | 'md';
  searchable?: boolean;
  mappingSucceedText?: string;
  mappingFailedText?: string;
  onChange?: (value: any) => void;
}

export const MappingItem = React.forwardRef<HTMLInputElement, IMappingItem>((props: IMappingItem, ref) => {
  const {
    heading,
    options,
    required,
    value,
    onChange,
    placeholder = 'Select field',
    size = 'sm',
    searchable = true,
    mappingFailedText = 'Not Mapped',
    mappingSucceedText = 'Mapping Successfull',
  } = props;
  const defaultGroupHeight = 45;
  const [groupHeight, setGroupHeight] = useState<number>(defaultGroupHeight);
  const groupRef = useRef<HTMLDivElement>(null);
  const { classes } = useStyles({ height: groupHeight });

  useEffect(() => {
    setGroupHeight(groupRef.current?.getBoundingClientRect().height || defaultGroupHeight);
  }, []);

  return (
    <Group className={classes.root} noWrap>
      <Group className={classes.selectionRoot} align="stretch" ref={groupRef} noWrap>
        <Text size={size} className={classes.heading}>
          {heading}
          {required ? <span className={classes.required}>&nbsp;*</span> : null}
        </Text>
        <Select
          placeholder={placeholder}
          value={value}
          data={options}
          classNames={{ root: classes.selectRoot, input: classes.select }}
          rightSection={<ChevronDown />}
          clearable
          size={size}
          searchable={searchable}
          dropdownComponent="div"
          onChange={(selectedValue) => onChange && onChange(selectedValue)}
          ref={ref}
        />
      </Group>
      <Text size={size} color={value ? 'black' : 'gray'} className={classes.statusText}>
        {value ? <GreenCheck /> : null}
        {value ? mappingSucceedText : mappingFailedText}
      </Text>
    </Group>
  );
});
