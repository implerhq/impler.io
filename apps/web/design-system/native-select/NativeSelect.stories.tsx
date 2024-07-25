import React from 'react';
import { NativeSelect } from './NativeSelect';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'NativeSelect',
  component: NativeSelect,
  argTypes: {
    clearable: { type: 'boolean' },
    searchable: { type: 'boolean' },
    noFoundText: { type: 'string' },
    placeholder: { type: 'string' },
    getCreateLabel: { type: 'function' },
    defaultValue: { type: 'string' },
  },
} as ComponentMeta<typeof NativeSelect>;

const Template: ComponentStory<typeof NativeSelect> = (args: any) => <NativeSelect {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  data: [
    {
      value: '1',
      label: 'One',
    },
  ],
};
