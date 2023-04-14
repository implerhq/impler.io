import React from 'react';
import { APIBlock } from './APIBlock';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'APIBlock',
  component: APIBlock,
  argTypes: {
    method: { type: 'string' },
    url: { type: 'string' },
    title: { type: 'string' },
  },
} as ComponentMeta<typeof APIBlock>;

const Template: ComponentStory<typeof APIBlock> = (args: any) => <APIBlock {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  method: 'GET',
  url: 'https://api.impler.io',
  title: 'Total Imports',
};
