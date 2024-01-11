import { ReactNode } from 'react';
import { MultiSelect as MantineMultiSelect, SelectItem } from '@mantine/core';
import useStyles from './MultiSelect.styles';

interface MultiSelectProps {
  placeholder?: string;
  data: SelectItem[] | string[];
  value?: string[];
  onCreate?: (value: string) => string;
  register?: any;
  label?: string;
  description?: ReactNode;
  searchable?: boolean;
  noFoundText?: string;
  creatable?: boolean;
  clearable?: boolean;
  maxSelectedValues?: number;
  getCreateLabel?: (value: string) => string;
  onChange?: (value: string[]) => void;
}

export function MultiSelect({
  placeholder,
  data,
  value,
  label,
  onCreate,
  onChange,
  searchable,
  noFoundText,
  clearable,
  creatable,
  description,
  getCreateLabel,
  maxSelectedValues,
}: MultiSelectProps) {
  const { classes } = useStyles();

  return (
    <MantineMultiSelect
      data={data}
      classNames={classes}
      placeholder={placeholder}
      searchable={searchable}
      nothingFound={noFoundText}
      clearable={clearable}
      getCreateLabel={getCreateLabel}
      creatable={creatable}
      value={value}
      withinPortal
      label={label}
      onCreate={onCreate}
      onChange={onChange}
      description={description}
      maxSelectedValues={maxSelectedValues}
    />
  );
}
