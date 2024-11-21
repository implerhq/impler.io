import React from 'react';
import { Tabs as MantineTabs } from '@mantine/core';
import { useStyles } from './IntegrationTabs.style';

interface TabItem {
  id?: string;
  value: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  value?: string;
  keepMounted?: boolean;
  defaultValue?: string;
  allowTabDeactivation?: boolean;
  onTabChange?: (value: string) => void;
}

export function IntegrationTabs({
  items,
  value,
  onTabChange,
  keepMounted,
  allowTabDeactivation,
  defaultValue,
}: TabsProps) {
  const { classes } = useStyles();

  return (
    <MantineTabs
      value={value}
      onTabChange={onTabChange}
      allowTabDeactivation={allowTabDeactivation}
      keepMounted={keepMounted}
      defaultValue={defaultValue}
      classNames={{
        tab: classes.tab,
        panel: classes.panel,
        tabsList: classes.tabsList,
      }}
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
