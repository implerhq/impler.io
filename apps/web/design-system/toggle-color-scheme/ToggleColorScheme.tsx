import { SunIcon } from '@assets/icons/Sun.icon';
import { MoonIcon } from '@assets/icons/Moon.icon';
import useStyles from './ToggleColorScheme.style';
import { useMantineColorScheme, SegmentedControl, Center } from '@mantine/core';

export function ColorSchemeToggle() {
  const { classes } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <SegmentedControl
      value={colorScheme}
      classNames={classes}
      onChange={(value: 'light' | 'dark') => toggleColorScheme(value)}
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
