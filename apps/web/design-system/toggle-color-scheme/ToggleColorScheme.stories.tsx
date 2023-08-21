import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ColorSchemeToggle } from './ToggleColorScheme';

export default {
  title: 'ColorSchemeToggle',
  component: ColorSchemeToggle,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ColorSchemeToggle>;

const Template: ComponentStory<typeof ColorSchemeToggle> = (args: any) => <ColorSchemeToggle {...args} />;

export const Primary = Template.bind({});
