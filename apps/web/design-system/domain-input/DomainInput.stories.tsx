import React from 'react';
import { DoaminInput } from './DoaminInput';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'DoaminInput',
  component: DoaminInput,
  argTypes: {},
} as ComponentMeta<typeof DoaminInput>;

const Template: ComponentStory<typeof DoaminInput> = (args: any) => <DoaminInput {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
