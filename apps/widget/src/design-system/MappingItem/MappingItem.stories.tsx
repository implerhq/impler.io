import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MappingItem } from './MappingItem';

export default {
  title: 'MappingItem',
  component: MappingItem,
} as ComponentMeta<typeof MappingItem>;

const Template: ComponentStory<typeof MappingItem> = (args) => <MappingItem {...args} />;

export const Simple = Template.bind({});

Simple.args = {
  options: [
    {
      label: 'Firstname',
      value: '1',
    },
    {
      label: 'Lastname',
      value: '2',
    },
  ],
  searchable: true,
  heading: 'First Name',
  size: 'sm',
  placeholder: 'Select Field',
};
