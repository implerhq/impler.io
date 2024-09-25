import React from 'react';
import { Validation } from './Validation';
import { ValidationTypesEnum } from '@impler/client';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Validation',
  component: Validation,
  argTypes: {},
} as ComponentMeta<typeof Validation>;

const Template: ComponentStory<typeof Validation> = (args: any) => <Validation {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Range Validation',
  type: ValidationTypesEnum.LENGTH,
  description: 'Specify the range the value should be in',
};
