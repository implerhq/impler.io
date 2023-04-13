import React from 'react';
import { SectionBlock } from './SectionBlock';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'SectionBlock',
  component: SectionBlock,
  argTypes: {
    title: { control: 'text' },
  },
} as ComponentMeta<typeof SectionBlock>;

const Template: ComponentStory<typeof SectionBlock> = (args: any) => <SectionBlock {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  title: 'SectionBlock',
};
