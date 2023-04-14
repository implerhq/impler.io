import React from 'react';
import { Tabs } from './Tabs';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Tabs',
  component: Tabs,
  argTypes: {},
} as ComponentMeta<typeof Tabs>;

const Template: ComponentStory<typeof Tabs> = (args: any) => <Tabs {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  items: [
    {
      value: 'tab1',
      title: 'Tab 1',
      content: 'Tab 1 content',
    },
    {
      value: 'tab2',
      title: 'Tab 2',
      content: 'Tab 2 content',
    },
  ],
  defaultValue: 'tab1',
};
