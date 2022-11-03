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
    onClear: {
      action: 'onClear',
    },
  },
} as ComponentMeta<typeof Dropzone>;

const Template: ComponentStory<typeof Dropzone> = (args) => <Dropzone {...args} />;

export const Default = Template.bind({});

export const WithFile = Template.bind({});
WithFile.args = {
  title: 'Select a file',
  file: {
    name: 'Document.tsx',
    size: 1200,
  } as unknown as File,
};
