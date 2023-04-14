import { MultiSelect as MantineMultiSelect, SelectItem } from '@mantine/core';
import useStyles from './MultiSelect.styles';

interface MultiSelectProps {
  placeholder?: string;
  data: SelectItem[];
  register?: any;
  searchable?: boolean;
  noFoundText?: string;
  creatable?: boolean;
  clearable?: boolean;
  getCreateLabel?: (value: string) => string;
}

export function MultiSelect({
  placeholder,
  data,
  register,
  searchable,
  noFoundText,
  clearable,
  creatable,
  getCreateLabel,
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
      {...(register || {})}
    />
  );
}
