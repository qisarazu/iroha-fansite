import type { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Slider } from './Slider';

export default {
  title: 'components/Slider',
  component: Slider,
} as ComponentMeta<typeof Slider>;

const Template: ComponentStory<typeof Slider> = (args) => (
  <div style={{ width: 300, marginTop: 30 }}>
    <Slider {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  value: 50,
  max: 50,
};

export const LabelDisplay = Template.bind({});
LabelDisplay.args = {
  labelDisplay: true,
};
