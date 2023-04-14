import React from 'react';
import { MultiSelect } from './MultiSelect';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'MultiSelect',
  component: MultiSelect,
  argTypes: {
    clearable: { type: 'boolean' },
    searchable: { type: 'boolean' },
    noFoundText: { type: 'string' },
    placeholder: { type: 'string' },
    getCreateLabel: { type: 'function' },
    creatable: { type: 'boolean' },
  },
} as ComponentMeta<typeof MultiSelect>;

const Template: ComponentStory<typeof MultiSelect> = (args: any) => <MultiSelect {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  data: [
    {
      value: '1',
      label: 'One',
    },
  ],
};
