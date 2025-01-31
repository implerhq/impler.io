import { MIME_TYPES } from '@mantine/dropzone';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UploadDropzone } from './UploadDropzone';

export default {
  title: 'Dropzone',
  component: UploadDropzone,
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
} as ComponentMeta<typeof UploadDropzone>;

const Template: ComponentStory<typeof UploadDropzone> = (args) => <UploadDropzone {...args} />;

export const Default = Template.bind({});

export const Primary = Template.bind({});
Primary.args = {};

export const WithError = Template.bind({});
WithError.args = {
  error: 'File is required',
};
