import { Tabs as MantineTabs } from '@mantine/core';
import useStyles from './Tabs.styles';

interface TabItem {
  id?: string;
  value: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  keepMounted?: boolean;
  defaultValue?: string;
  allowTabDeactivation?: boolean;
}

export function Tabs({ items, keepMounted, allowTabDeactivation, defaultValue }: TabsProps) {
  const { classes } = useStyles();

  return (
    <MantineTabs
      allowTabDeactivation={allowTabDeactivation}
      keepMounted={keepMounted}
      defaultValue={defaultValue}
      classNames={classes}
      variant="pills"
    >
      <MantineTabs.List>
        {items.map((item) => (
          <MantineTabs.Tab data-id={item.id} key={item.value} value={item.value} icon={item.icon}>
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
