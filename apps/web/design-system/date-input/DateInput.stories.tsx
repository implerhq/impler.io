import React from 'react';
import { DateInput } from './DateInput';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'DateInput',
  component: DateInput,
  argTypes: {
    value: { control: 'date' },
    onChange: { action: 'onChange' },
    placeholder: { control: 'text' },
  },
} as ComponentMeta<typeof DateInput>;

const Template: ComponentStory<typeof DateInput> = (args: any) => <DateInput {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  onChange: () => {},
  value: new Date(),
  placeholder: 'Date',
};
