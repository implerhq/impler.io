import { forwardRef } from 'react';
import useStyles from './UserMenu.styles';
import { ChevronDown } from '@assets/icons';
import { Avatar, Group, UnstyledButton, Text, Menu } from '@mantine/core';

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
  classNames?: Record<string, string>;
}

type MenuItemType = {
  title: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    image: string;
  };
  menus?: MenuItemType[];
  width?: number;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, name, email, icon, classNames, ...others }: UserButtonProps, ref: any) => (
    <UnstyledButton ref={ref} {...others}>
      <Group spacing="xs">
        <Avatar src={image} className={classNames?.avatar} />
        <div style={{ flex: 1 }}>
          <Text size="sm" className={classNames?.name}>
            {name}
          </Text>
          <Text color="dimmed" size="xs">
            {email}
          </Text>
        </div>
        {icon || <ChevronDown />}
      </Group>
    </UnstyledButton>
  )
);

UserButton.displayName = 'UserButton';

export function UserMenu({ menus, width, user }: UserMenuProps) {
  const { classes } = useStyles();

  return (
    <Menu closeOnEscape position="bottom-end" classNames={{ item: classes.dropdown }} width={width} offset={10}>
      <Menu.Target>
        <UserButton image={user.image} name={user.name} email={user.email} classNames={classes} />
      </Menu.Target>
      <Menu.Dropdown>
        {menus?.map((menuItem, index) => (
          <Menu.Item icon={menuItem.icon} key={index}>
            {menuItem.title}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
