import React from 'react';
import { Textarea } from './Textarea';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Textarea',
  component: Textarea,
  argTypes: {
    placeholder: { type: 'string' },
    required: { type: 'boolean' },
  },
} as ComponentMeta<typeof Textarea>;

const Template: ComponentStory<typeof Textarea> = (args: any) => <Textarea {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  placeholder: 'Placeholder',
};
