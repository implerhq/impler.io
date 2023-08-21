import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '@ui/button';

export default {
  title: 'Modal',
  component: Modal,
  argTypes: {
    opened: { type: 'boolean' },
    onClose: { action: 'onClose' },
    title: { type: 'string' },
    size: {
      control: {
        type: 'select',
        options: ['xs', 'sm', 'md', 'lg', 'xl'],
      },
    },
  },
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args: any) => <Modal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  opened: true,
  onClose: () => {},
};

export const WithTitle = Template.bind({});
WithTitle.args = {
  opened: true,
  onClose: () => {},
  title: 'Modal Title',
};

export const WithFooter = Template.bind({});
WithFooter.args = {
  opened: true,
  onClose: () => {},
  title: 'Modal Title',
  footerActions: [
    <Button key="cancel" variant="outline" color="invariant">
      Cancel
    </Button>,
    <Button key="submit">Submit</Button>,
  ],
};
