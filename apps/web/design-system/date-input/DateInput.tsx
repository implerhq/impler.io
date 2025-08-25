import { DateInput as MantineDateInput } from '@mantine/dates';

import { colors } from '@config';
import useStyles from './DateInput.styles';
import { CalendarIcon } from '@assets/icons/Calendar.icon';

interface IDateInputProps {
  value?: Date;
  onChange: (value: Date) => void;
  placeholder?: string;
  maw?: number;
  valueFormat?: string;
  allowDeselect?: boolean;
}

export function DateInput({ onChange, value, placeholder, maw, valueFormat, allowDeselect }: IDateInputProps) {
  const { classes } = useStyles();

  return (
    <MantineDateInput
      clearable
      rightSection={<CalendarIcon color={colors.black} />}
      classNames={classes}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      allowDeselect={allowDeselect}
      maw={maw}
      valueFormat={valueFormat}
    />
  );
}
