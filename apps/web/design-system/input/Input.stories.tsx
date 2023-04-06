import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Input } from './Input';

export default {
  title: 'Input',
  component: Input,
  argTypes: {
    placeholder: { type: 'string' },
    error: { type: 'string' },
    disabled: { type: 'boolean' },
  },
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args: any) => <Input {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  placeholder: 'Enter your name',
};

export const WithError = Template.bind({});
WithError.args = {
  placeholder: 'Enter your name',
  error: 'This field is required',
};
