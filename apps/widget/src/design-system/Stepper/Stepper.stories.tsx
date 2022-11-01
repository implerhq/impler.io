import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Stepper } from './Stepper';

export default {
  title: 'Stepper',
  component: Stepper,
} as ComponentMeta<typeof Stepper>;

const Template: ComponentStory<typeof Stepper> = (args) => <Stepper {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  active: 1,
  steps: [
    {
      label: 'Import',
    },
    {
      label: 'Mapping',
    },
    {
      label: 'Review',
    },
  ],
  size: 'xs',
};
