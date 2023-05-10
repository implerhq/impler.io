import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Pagination } from './Pagination';
import { VARIABLES } from '@config';

export default {
  title: 'Pagination',
  component: Pagination,
  argTypes: {
    limit: {
      control: {
        type: 'select',
        options: [VARIABLES.TEN, VARIABLES.TWENTY, VARIABLES.THIRTY, VARIABLES.FORTY, VARIABLES.FIFTY],
      },
    },
    dataLength: {
      control: {
        type: 'number',
      },
    },
    page: {
      control: {
        type: 'number',
      },
    },
    totalPages: {
      control: {
        type: 'number',
      },
    },
    totalRecords: {
      control: {
        type: 'number',
      },
    },
  },
} as ComponentMeta<typeof Pagination>;

const Template: ComponentStory<typeof Pagination> = (args: any) => <Pagination {...args} />;

export const Default = Template.bind({});
Default.args = {
  limit: 10,
  dataLength: 100,
  page: 1,
  totalPages: 10,
  totalRecords: 100,
};
