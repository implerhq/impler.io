import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DraggableTable } from './DraggableTable';

interface SampleItem {
  _id: string;
  firstName: string;
  lastName: string;
  surname: string;
}

export default {
  title: 'DraggableTable',
  component: DraggableTable,
} as ComponentMeta<typeof DraggableTable>;

const Template: ComponentStory<typeof DraggableTable<SampleItem>> = (args) => <DraggableTable {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  headings: [
    { title: 'First Name', key: 'firstName' },
    { title: 'Last Name', key: 'lastName' },
    { title: 'Surname', key: 'surname' },
  ],
  data: [
    { _id: '1', firstName: 'John', lastName: 'Baber', surname: 'Doe' },
    { _id: '2', firstName: 'Jane', lastName: 'Doe', surname: 'Doe' },
  ],
};
