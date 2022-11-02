import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Select } from './Select';

export default {
  title: 'Select',
  component: Select,
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args) => <Select {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  title: 'Template',
  data: [{ value: 'Users', label: 'Users' }],
  placeholder: 'Select Template',
};
