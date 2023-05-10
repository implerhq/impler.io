import { MultiSelect as MantineMultiSelect, SelectItem } from '@mantine/core';
import useStyles from './MultiSelect.styles';

interface MultiSelectProps {
  placeholder?: string;
  data: SelectItem[] | string[];
  value?: string[];
  onCreate?: (value: string) => string;
  register?: any;
  searchable?: boolean;
  noFoundText?: string;
  creatable?: boolean;
  clearable?: boolean;
  getCreateLabel?: (value: string) => string;
  onChange?: (value: string[]) => void;
}

export function MultiSelect({
  placeholder,
  data,
  value,
  onCreate,
  onChange,
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
      value={value}
      onCreate={onCreate}
      onChange={onChange}
    />
  );
}
