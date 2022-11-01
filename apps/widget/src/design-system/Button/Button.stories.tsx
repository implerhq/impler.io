import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from './Button';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    onClick: {
      action: 'clicked',
    },
    size: {
      control: {
        type: 'select',
        options: ['xs', 'sm', 'md', 'lg', 'xl'],
      },
    },
    color: {
      control: {
        type: 'select',
        options: ['red', 'green', 'blue'],
      },
    },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  children: 'Click me',
  variant: 'filled',
  disabled: false,
  loading: false,
  color: 'blue',
};
