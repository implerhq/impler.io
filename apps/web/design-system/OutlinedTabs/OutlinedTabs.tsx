import { Tabs as MantineTabs, Flex, Badge } from '@mantine/core';
import useStyles from './OutlinedTabs.style';

interface OutlinedTabItem {
  id?: string;
  value: string;
  title: string;
  badgeCount?: number; // Optional badge count
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface OutlinedTabsProps {
  items: OutlinedTabItem[];
  value?: string;
  keepMounted?: boolean;
  defaultValue?: string;
  allowTabDeactivation?: boolean;
  onTabChange?: (value: string) => void;
  inviteButton?: React.ReactNode; // Optional invite button
}

export function OutlinedTabs({
  items,
  value,
  onTabChange,
  keepMounted,
  allowTabDeactivation,
  defaultValue,
  inviteButton,
}: OutlinedTabsProps) {
  const { classes } = useStyles();

  return (
    <MantineTabs
      value={value}
      onTabChange={onTabChange}
      allowTabDeactivation={allowTabDeactivation}
      keepMounted={keepMounted}
      defaultValue={defaultValue}
      classNames={classes}
    >
      <Flex justify="space-between" gap="xs" align="flex-end">
        <MantineTabs.List style={{ flexGrow: 1 }}>
          {items.map((item) => (
            <MantineTabs.Tab key={item.value} value={item.value} icon={item.icon}>
              {item.title}
              {item.badgeCount !== undefined && (
                <Badge size="lg" p={5} color="gray">
                  {item.badgeCount}
                </Badge>
              )}
            </MantineTabs.Tab>
          ))}
        </MantineTabs.List>
        {inviteButton}
      </Flex>

      {items.map((item) => (
        <MantineTabs.Panel key={item.value} value={item.value} pt="xs">
          {item.content}
        </MantineTabs.Panel>
      ))}
    </MantineTabs>
  );
}
