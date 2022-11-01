import { ComponentStory, ComponentMeta } from '@storybook/react';
import { File } from './File';

export default {
  title: 'File',
  component: File,
  argTypes: {
    onClear: {
      action: 'onClear',
    },
  },
} as ComponentMeta<typeof File>;

const Template: ComponentStory<typeof File> = (args) => <File {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  name: 'Document.xlsx',
  size: 1000,
};
