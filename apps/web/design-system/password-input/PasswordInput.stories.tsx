import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PasswordInput } from './PasswordInput';

export default {
  title: 'PasswordInput',
  component: PasswordInput,
  argTypes: {
    placeholder: { type: 'string' },
    error: { type: 'string' },
    disabled: { type: 'boolean' },
  },
} as ComponentMeta<typeof PasswordInput>;

const Template: ComponentStory<typeof PasswordInput> = (args: any) => <PasswordInput {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  placeholder: 'Enter your password',
};

export const WithError = Template.bind({});
WithError.args = {
  placeholder: 'Enter your password',
  error: 'This field is required',
};

export const Disabled = Template.bind({});
Disabled.args = {
  placeholder: 'Enter your password',
  disabled: true,
};
