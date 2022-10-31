import { MIME_TYPES } from '@mantine/dropzone';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Dropzone } from './Dropzone';

export default {
  title: 'Dropzone',
  component: Dropzone,
  argTypes: {
    accept: {
      control: {
        type: 'multi-select',
        options: MIME_TYPES,
      },
    },
    onDrop: {
      action: 'onDrop',
    },
  },
} as ComponentMeta<typeof Dropzone>;

const Template: ComponentStory<typeof Dropzone> = (args) => <Dropzone {...args} />;

export const Simple = Template.bind({});
