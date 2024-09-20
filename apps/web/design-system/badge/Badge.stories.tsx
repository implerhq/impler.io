import React from 'react';
import { Badge } from './Badge';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Badge',
  component: Badge,
} as ComponentMeta<typeof Badge>;

const Template: ComponentStory<typeof Badge> = (args: any) => <Badge {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'Primary Badge',
};
