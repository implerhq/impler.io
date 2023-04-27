import React from 'react';
import { IconButton } from './IconButton';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'IconButton',
  component: IconButton,
  argTypes: {
    withArrow: { control: 'boolean' },
    label: { control: 'text' },
  },
} as ComponentMeta<typeof IconButton>;

const Template: ComponentStory<typeof IconButton> = (args: any) => <IconButton {...args}>Click Me</IconButton>;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Click me',
};
