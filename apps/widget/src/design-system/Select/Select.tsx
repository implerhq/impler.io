import { NativeSelect as MantineNativeSelect } from '@mantine/core';
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
}

export function Select(props: ISelectProps) {
  const { title, placeholder, data, error, required = true, width = '100%' } = props;
  const { classes } = useStyles({ width });

  return (
    <MantineNativeSelect
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
      required={required}
    />
  );
}
