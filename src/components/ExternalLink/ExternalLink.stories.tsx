import type { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ExternalLink } from './ExternalLink';

export default {
  title: 'components/ExternalLink',
  component: ExternalLink,
} as ComponentMeta<typeof ExternalLink>;

const Template: ComponentStory<typeof ExternalLink> = (args) => <ExternalLink {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: '外部リンク',
};
