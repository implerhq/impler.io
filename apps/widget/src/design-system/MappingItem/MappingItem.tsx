import { Group, Select, Text } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import useStyles from './MappingItem.style';
import { ChevronDown, GreenCheck } from '../../icons';

interface IOption {
  label: string;
  value: string;
}

interface IMappingItem {
  heading: string;
  required?: boolean;
  options: IOption[];
  value?: string;
  placeholder?: string;
  size?: 'sm' | 'md';
  searchable?: boolean;
  mappingSucceedText?: string;
  mappingFailedText?: string;
}

export function MappingItem(props: IMappingItem) {
  const {
    heading,
    options,
    required,
    value,
    placeholder = 'Select field',
    size = 'sm',
    searchable = true,
    mappingFailedText = 'Not Mapped',
    mappingSucceedText = 'Mapping Successfull',
  } = props;
  const [groupHeight, setGroupHeight] = useState<number>(0);
  const groupRef = useRef<HTMLDivElement>(null);
  const { classes } = useStyles({ height: groupHeight });

  useEffect(() => {
    setGroupHeight(groupRef.current?.getBoundingClientRect().height || 45);
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
        />
      </Group>
      <Text size={size} color={value ? 'black' : 'gray'} className={classes.statusText}>
        {value ? <GreenCheck /> : null}
        {value ? mappingSucceedText : mappingFailedText}
      </Text>
    </Group>
  );
}
