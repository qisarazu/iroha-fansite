import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { Switch } from './Switch';

export default {
  title: 'components/Switch',
  component: Switch,
} as ComponentMeta<typeof Switch>;

const Template: ComponentStory<typeof Switch> = (args) => <Switch {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Label = Template.bind({});
Label.args = {
  label: 'Label',
};
