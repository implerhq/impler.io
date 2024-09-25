import React from 'react';
import { Meta, Story } from '@storybook/react';
import { OutlinedTabs } from './OutlinedTabs';

export default {
  title: 'OutlinedTabs',
  component: OutlinedTabs,
  argTypes: {
    onTabChange: { action: 'tab changed' },
  },
} as Meta;

const Template: Story<any> = (args) => <OutlinedTabs {...args} />;

export const Default = Template.bind({});
Default.args = {
  items: [
    {
      value: 'tab1',
      title: 'Tab 1',
      content: <div>Content for Tab 1</div>,
    },
    {
      value: 'tab2',
      title: 'Tab 2',
      content: <div>Content for Tab 2</div>,
    },
    {
      value: 'tab3',
      title: 'Tab 3',
      content: <div>Content for Tab 3</div>,
    },
  ],
  defaultValue: 'tab1',
};
