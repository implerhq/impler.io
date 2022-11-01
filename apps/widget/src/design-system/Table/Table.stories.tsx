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

export const CustomCellRender = Template.bind({});
CustomCellRender.args = {
  headings: [
    { title: 'First Name', key: 'firstName', Cell: (item) => <b>{item.firstName}</b> },
    { title: 'Last Name', key: 'lastName' },
    { title: 'Surname', key: 'surname' },
  ],
  data: [{ firstName: 'John', lastName: 'Baber', surname: 'Doe' }],
};
