import { SunIcon } from '@assets/icons/Sun.icon';
import { MoonIcon } from '@assets/icons/Moon.icon';
import useStyles from './ToggleColorScheme.style';
import { useMantineColorScheme, SegmentedControl, Center } from '@mantine/core';

interface ColorSchemeToggleProps {
  onChange?: (value: 'light' | 'dark') => void;
}

export function ColorSchemeToggle({ onChange }: ColorSchemeToggleProps) {
  const { classes } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <SegmentedControl
      value={colorScheme}
      classNames={classes}
      onChange={(value: 'light' | 'dark') => {
        toggleColorScheme(value);
        onChange?.(value);
      }}
      data={[
        {
          value: 'light',
          label: (
            <Center>
              <SunIcon />
            </Center>
          ),
        },
        {
          value: 'dark',
          label: (
            <Center>
              <MoonIcon />
            </Center>
          ),
        },
      ]}
    />
  );
}
