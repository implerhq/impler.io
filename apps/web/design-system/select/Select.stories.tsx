import React from 'react';
import { Select } from './Select';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Select',
  component: Select,
  argTypes: {
    clearable: { type: 'boolean' },
    searchable: { type: 'boolean' },
    noFoundText: { type: 'string' },
    placeholder: { type: 'string' },
    getCreateLabel: { type: 'function' },
    defaultValue: { type: 'string' },
  },
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args: any) => <Select {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  data: [
    {
      value: '1',
      label: 'One',
    },
  ],
};
