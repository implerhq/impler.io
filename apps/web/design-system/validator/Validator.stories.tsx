import React from 'react';
import { Validator } from './Validator';
import { ValidatorTypesEnum } from '@impler/shared';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Validator',
  component: Validator,
  argTypes: {},
} as ComponentMeta<typeof Validator>;

const Template: ComponentStory<typeof Validator> = (args: any) => <Validator {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Range Validation',
  type: ValidatorTypesEnum.LENGTH,
  description: 'Specify the range the value should be in',
};
