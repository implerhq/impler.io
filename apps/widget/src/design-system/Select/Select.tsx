import React from 'react';
import { Select as MantineNativeSelect } from '@mantine/core';
import useStyles from './Select.styles';
import { ChevronDown } from '../../icons';

interface IOption {
  value: string;
  label: string;
}

export interface ISelectProps {
  title?: string;
  placeholder?: string;
  data: IOption[];
  error?: string;
  required?: boolean;
  width?: string | number;
  value?: string;
  onChange?: (value: any) => void;
}

export const Select = React.forwardRef<HTMLInputElement, ISelectProps>((props: ISelectProps, ref) => {
  const { title, placeholder, data, error, required = true, width = '100%', onChange, value, ...extraProps } = props;
  const { classes } = useStyles({ width });

  return (
    <MantineNativeSelect
      ref={ref}
      title={title}
      placeholder={placeholder}
      data={data}
      error={error}
      label={title}
      rightSection={<ChevronDown />}
      classNames={{
        label: classes.label,
        input: classes.select,
        root: classes.root,
      }}
      value={value}
      onChange={(selectedValue) => onChange && onChange(selectedValue)}
      required={required}
      {...extraProps}
    />
  );
});
