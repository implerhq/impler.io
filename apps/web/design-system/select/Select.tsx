import { Select as MantineSelect, SelectItem } from '@mantine/core';
import useStyles from './Select.styles';

interface SelectProps {
  placeholder?: string;
  data: SelectItem[];
  register?: any;
  searchable?: boolean;
  noFoundText?: string;
  clearable?: boolean;
  defaultValue?: string;
  getCreateLabel?: (value: string) => string;
}

export function Select({
  placeholder,
  data,
  register,
  searchable,
  noFoundText,
  clearable,
  defaultValue,
  getCreateLabel,
}: SelectProps) {
  const { classes } = useStyles();

  return (
    <MantineSelect
      data={data}
      classNames={classes}
      placeholder={placeholder}
      searchable={searchable}
      nothingFound={noFoundText}
      clearable={clearable}
      getCreateLabel={getCreateLabel}
      defaultValue={defaultValue}
      {...(register || {})}
    />
  );
}
