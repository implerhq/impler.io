import React, { CSSProperties } from 'react';
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
  data: string[] | IOption[];
  error?: string;
  required?: boolean;
  width?: string | number;
  value?: string;
  defaultValue?: string;
  withinPortal?: boolean;
  style?: CSSProperties;
  onChange?: (value: any) => void;
}

export const Select = React.forwardRef<HTMLInputElement, ISelectProps>((props: ISelectProps, ref) => {
  const {
    title,
    placeholder,
    data,
    error,
    defaultValue,
    required = true,
    width = '100%',
    onChange,
    value,
    style,
    withinPortal,
    ...extraProps
  } = props;
  const { classes } = useStyles({ width });

  return (
    <MantineNativeSelect
      ref={ref}
      title={title}
      placeholder={placeholder}
      data={data}
      style={style}
      error={error}
      label={title}
      defaultValue={defaultValue}
      rightSection={<ChevronDown />}
      classNames={{
        label: classes.label,
        input: classes.select,
        root: classes.root,
      }}
      value={value}
      withinPortal={withinPortal}
      onChange={(selectedValue) => onChange && onChange(selectedValue)}
      required={required}
      {...extraProps}
    />
  );
});
