import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ImportCard } from './ImportCard';

export default {
  title: 'app/ImportCard',
  component: ImportCard,
  argTypes: {},
} as ComponentMeta<typeof ImportCard>;

const Template: ComponentStory<typeof ImportCard> = (args: any) => <ImportCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
