import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { NumberInput } from './NumberInput';

export default {
  title: 'NumberInput',
  component: NumberInput,
  argTypes: {
    placeholder: { type: 'string' },
    error: { type: 'string' },
    disabled: { type: 'boolean' },
  },
} as ComponentMeta<typeof NumberInput>;

const Template: ComponentStory<typeof NumberInput> = (args: any) => <NumberInput {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  placeholder: 'Price',
};

export const WithError = Template.bind({});
WithError.args = {
  placeholder: 'Price',
  error: 'This field is required',
};
