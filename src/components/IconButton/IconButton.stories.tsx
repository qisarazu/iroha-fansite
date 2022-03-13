import type { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { MdSearch } from 'react-icons/md';

import { IconButton } from './IconButton';

export default {
  title: 'components/IconButton',
  component: IconButton,
} as ComponentMeta<typeof IconButton>;

const Template: ComponentStory<typeof IconButton> = (args) => <IconButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: <MdSearch />,
};
