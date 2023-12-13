import type { Meta, StoryFn } from '@storybook/react';

import { InformationList } from './InformationList';

export default {
  title: 'components/features/information/InformationList',
  component: InformationList,
} as Meta<typeof InformationList>;

const StoryTemplate: StoryFn<typeof InformationList> = (args) => <InformationList {...args} />;

export const Default = StoryTemplate.bind({});
Default.args = {
  items: [
    {
      href: '#',
      src: 'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/iroha_2nd_aniv.webp',
      title: 'あああ',
      startAt: new Date(),
      endAt: new Date(),
      showTime: true,
    },
    {
      href: '#',
      src: 'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/iroha_2nd_aniv.webp',
      title: 'あああ',
      startAt: new Date(),
      endAt: new Date(),
    },
    {
      href: '#',
      src: 'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/iroha_2nd_aniv.webp',
      title: 'あああ',
      startAt: new Date(),
      endAt: new Date(),
      showTime: true,
    },
    {
      href: '#',
      src: 'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/iroha_2nd_aniv.webp',
      title: 'あああ',
      startAt: new Date(),
      endAt: new Date(),
    },
  ],
};
