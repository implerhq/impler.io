import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from './Button';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    color: {
      control: {
        type: 'select',
        options: ['blue', 'white'],
      },
    },
    variant: {
      control: {
        type: 'select',
        options: ['filled', 'outline'],
      },
    },
    children: {
      control: {
        type: 'text',
      },
    },
    size: {
      control: {
        type: 'select',
        options: ['xs', 'sm', 'md', 'lg', 'xl'],
      },
    },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args: any) => <Button {...args} />;

export const Filled = Template.bind({});
Filled.args = {
  children: 'Filled Button',
  size: 'sm',
};

export const Outline = Template.bind({});
Outline.args = {
  children: 'Outline Button',
  variant: 'outline',
  size: 'sm',
};

export const OutlineWitColor = Template.bind({});
OutlineWitColor.args = {
  children: 'Outline Button',
  variant: 'outline',
  color: 'white',
};
