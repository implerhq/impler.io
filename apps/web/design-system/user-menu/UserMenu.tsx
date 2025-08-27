import useStyles from './UserMenu.styles';
import { Avatar, Group, UnstyledButton, Text, Menu } from '@mantine/core';
import { capitalizeFirstLetterOfName } from '@shared/utils';

type MenuItemType = {
  title: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    image: string;
  };
  menus?: MenuItemType[];
  width?: number;
  collapsed?: boolean;
}

export function UserMenu({ menus, width, user, collapsed }: UserMenuProps) {
  const { classes } = useStyles({ collapsed });

  return (
    <Menu closeOnEscape position="bottom-end" classNames={{ item: classes.dropdown }} width={width} offset={10}>
      <Menu.Target>
        <UnstyledButton className={classes.button}>
          <Group spacing="sm">
            <Avatar src={user.image} className={classes.avatar} />
            {collapsed ? null : (
              <div style={{ flex: 1 }}>
                <Text size="sm" className={classes.name}>
                  {capitalizeFirstLetterOfName(user.name)}
                </Text>
                <Text color="dimmed" size="xs">
                  {/* {user.email} */}
                </Text>
              </div>
            )}
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        {menus?.map((menuItem, index) => (
          <Menu.Item disabled={menuItem.disabled} onClick={menuItem.onClick} icon={menuItem.icon} key={index}>
            {menuItem.title}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
