import React from 'react';
import { MinMaxValidator } from './MinMaxValidator';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Validator',
  component: MinMaxValidator,
  argTypes: {},
} as ComponentMeta<typeof MinMaxValidator>;

const Template: ComponentStory<typeof MinMaxValidator> = (args: any) => <MinMaxValidator {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Range Validation',
  description: 'Specify the range the value should be in',
};
