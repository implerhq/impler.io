import { useMantineColorScheme } from '@mantine/core';
import { DateInput as MantineDateInput } from '@mantine/dates';

import { colors } from '@config';
import useStyles from './DateInput.styles';
import { CalendarIcon } from '@assets/icons/Calendar.icon';

interface IDateInputProps {
  value?: Date;
  onChange: (value: Date) => void;
  placeholder?: string;
  maw?: number;
}

export function DateInput({ onChange, value, placeholder, maw }: IDateInputProps) {
  const { colorScheme } = useMantineColorScheme();
  const { classes } = useStyles();

  return (
    <MantineDateInput
      rightSection={<CalendarIcon color={colorScheme === 'dark' ? colors.white : colors.black} />}
      classNames={classes}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      maw={maw}
    />
  );
}
