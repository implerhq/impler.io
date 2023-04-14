import { Tabs as MantineTabs } from '@mantine/core';
import useStyles from './Tabs.styles';

interface TabItem {
  value: string;
  title: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
}

export function Tabs({ items, defaultValue }: TabsProps) {
  const { classes } = useStyles();

  return (
    <MantineTabs defaultValue={defaultValue} classNames={classes} variant="pills">
      <MantineTabs.List>
        {items.map((item) => (
          <MantineTabs.Tab key={item.value} value={item.value}>
            {item.title}
          </MantineTabs.Tab>
        ))}
      </MantineTabs.List>
      {items.map((item) => (
        <MantineTabs.Panel key={item.value} value={item.value}>
          {item.content}
        </MantineTabs.Panel>
      ))}
    </MantineTabs>
  );
}
