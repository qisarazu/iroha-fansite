import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { Spinner } from './Spinner';

export default {
  title: 'components/Spinner',
  component: Spinner,
} as ComponentMeta<typeof Spinner>;

const Template: ComponentStory<typeof Spinner> = (args) => <Spinner {...args} />;

export const Default = Template.bind({});
Default.args = {};
