import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { IconButton } from './IconButton';
import { MdSearch } from 'react-icons/md';

export default {
  title: 'components/IconButton',
  component: IconButton
} as ComponentMeta<typeof IconButton>;

const Template: ComponentStory<typeof IconButton> = (args) => (
  <IconButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: <MdSearch />
};
