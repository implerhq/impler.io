import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Checkbox } from './Checkbox';

export default {
  title: 'Checkbox',
  component: Checkbox,
  argTypes: {
    label: { type: 'string' },
  },
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args: any) => <Checkbox {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: "I'm a checkbox",
};
