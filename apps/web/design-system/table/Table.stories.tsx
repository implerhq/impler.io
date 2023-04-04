import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Table } from './Table';

export default {
  title: 'Table',
  component: Table,
} as ComponentMeta<typeof Table>;

const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  headings: [
    { title: 'First Name', key: 'firstName' },
    { title: 'Last Name', key: 'lastName' },
    { title: 'Surname', key: 'surname' },
  ],
  data: [{ firstName: 'John', lastName: 'Baber', surname: 'Doe' }],
};

export const Empty = Template.bind({});
Empty.args = {
  headings: [
    { title: 'First Name', key: 'firstName' },
    { title: 'Last Name', key: 'lastName' },
    { title: 'Surname', key: 'surname' },
  ],
  data: [],
};

export const CustomCell = Template.bind({});
CustomCell.args = {
  headings: [
    { title: 'First Name', key: 'firstName' },
    { title: 'Last Name', key: 'lastName' },
    { title: 'Surname', key: 'surname' },
    {
      title: 'Full Name',
      key: 'fullName',
      Cell: (item) => `${item.firstName} ${item.lastName} ${item.surname}`,
    },
  ],
  data: [{ firstName: 'John', lastName: 'Baber', surname: 'Doe' }],
};
