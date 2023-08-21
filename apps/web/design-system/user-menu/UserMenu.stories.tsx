import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UserMenu } from './UserMenu';

export default {
  title: 'UserMenu',
  component: UserMenu,
  argTypes: {
    user: {
      control: {
        type: 'object',
      },
    },
    menus: {
      control: {
        type: 'object',
      },
    },
    width: {
      control: {
        type: 'number',
      },
    },
  },
} as ComponentMeta<typeof UserMenu>;

const Template: ComponentStory<typeof UserMenu> = (args: any) => <UserMenu {...args} />;

export const Default = Template.bind({});
Default.args = {
  user: {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    image: 'https://avatars.githubusercontent.com/u/15199031?v=4',
  },
  menus: [
    {
      title: 'Profile',
    },
  ],
  width: 200,
};
