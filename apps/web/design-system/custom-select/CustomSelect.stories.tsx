import React from 'react';
import { CustomSelect } from './CustomSelect';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'CustomSelect',
  component: CustomSelect,
  argTypes: {},
} as ComponentMeta<typeof CustomSelect>;

const Template: ComponentStory<typeof CustomSelect> = (args: any) => <CustomSelect {...args} />;

export const Default = Template.bind({});
Default.args = {
  data: [
    {
      value: '1',
      label: 'One',
    },
    {
      value: '2',
      label: 'Two',
    },
  ],
};

export const WithPlaceholder = Template.bind({});
WithPlaceholder.args = {
  data: [
    {
      value: '1',
      label: 'One',
    },
    {
      value: '2',
      label: 'Two',
    },
  ],
  placeholder: 'Select an option',
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  data: [
    {
      value: '1',
      label: 'One',
    },
    {
      value: '2',
      label: 'Two',
    },
  ],
  label: 'Select an option',
};

export const WithValue = Template.bind({});
WithValue.args = {
  data: [
    {
      value: '<<1>>',
      label: 'One',
    },
    {
      value: '<<2>>',
      label: 'Two',
    },
  ],
  value: '<<1>>',
};

export const WithText = Template.bind({});
WithText.args = {
  data: [
    {
      value: '1',
      label: 'One',
    },
    {
      value: '2',
      label: 'Two',
    },
  ],
  value: 'Hello World!!',
};
