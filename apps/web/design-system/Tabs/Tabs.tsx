import { Tabs as MantineTabs, Tooltip } from '@mantine/core';
import useStyles from './Tabs.styles';

interface TabItem {
  id?: string;
  value: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  disabledTooltip?: string;
}

interface TabsProps {
  items: TabItem[];
  value?: string;
  keepMounted?: boolean;
  defaultValue?: string;
  allowTabDeactivation?: boolean;
  onTabChange?: (value: string) => void;
}

export function Tabs({ items, value, onTabChange, keepMounted, allowTabDeactivation, defaultValue }: TabsProps) {
  const { classes } = useStyles();

  return (
    <MantineTabs
      value={value}
      onTabChange={onTabChange}
      allowTabDeactivation={allowTabDeactivation}
      keepMounted={keepMounted}
      defaultValue={defaultValue}
      classNames={classes}
      variant="pills"
    >
      <MantineTabs.List>
        {items.map((item) => (
          <Tooltip
            key={item.value}
            label={item.disabledTooltip || 'This feature is not available in your current plan'}
            disabled={!item.disabled}
            position="top"
            withArrow
            multiline
            withinPortal
          >
            <MantineTabs.Tab
              data-id={item.id}
              value={item.value}
              icon={item.disabled ? item.icon : null}
              disabled={item.disabled}
            >
              {item.title}
            </MantineTabs.Tab>
          </Tooltip>
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
