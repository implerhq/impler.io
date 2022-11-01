import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Pagination } from './Pagination';

export default {
  title: 'Pagination',
  component: Pagination,
  argTypes: {
    onChange: {
      action: 'onChange',
    },
  },
} as ComponentMeta<typeof Pagination>;

const Template: ComponentStory<typeof Pagination> = (args) => <Pagination {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  total: 10,
  page: 1,
  limit: 10,
  totalRecords: 100,
};
