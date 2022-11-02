import { NativeSelect as MantineNativeSelect } from '@mantine/core';
import useStyles from './Select.styles';
import { ChevronDown } from '../../icons';

interface IOption {
  value: string;
  label: string;
}

interface ISelectProps {
  title?: string;
  placeholder?: string;
  data: IOption[];
  error?: string;
  required?: boolean;
}

export function Select(props: ISelectProps) {
  const { classes } = useStyles();
  const { title, placeholder, data, error, required = true } = props;

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
      }}
      required={required}
    />
  );
}
