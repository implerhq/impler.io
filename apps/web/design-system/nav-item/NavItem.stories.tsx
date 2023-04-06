import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { NavItem } from './NavItem';
import { Import } from '@assets/icons/Import.icon';

export default {
  title: 'NavItem',
  component: NavItem,
  argTypes: {},
} as ComponentMeta<typeof NavItem>;

const Template: ComponentStory<typeof NavItem> = (args: any) => <NavItem {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  icon: <Import size="xl" />,
  title: 'Import',
};
