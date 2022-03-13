import type { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { KebabMenu } from './KebabMenu';

export default {
  title: 'components/KebabMenu',
  component: KebabMenu,
} as ComponentMeta<typeof KebabMenu>;

const Template: ComponentStory<typeof KebabMenu> = (args) => <KebabMenu {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: (
    <>
      <a href="">LINK</a>
      <a href="">LINK</a>
    </>
  ),
};
