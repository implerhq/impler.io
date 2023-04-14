import React from 'react';
import { Card } from './Card';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Card',
  component: Card,
  argTypes: {
    title: { type: 'string' },
    subtitle: { type: 'string' },
  },
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args: any) => <Card {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  title: 'Total Imports',
  subtitle: '19K',
};
