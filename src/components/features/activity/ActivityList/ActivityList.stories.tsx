import { ActivityStatus, ActivityType } from '@prisma/client';
import type { Meta, StoryFn } from '@storybook/react';

import { ActivityList } from './ActivityList';

export default {
  title: 'components/features/activity/ActivityList',
  component: ActivityList,
} as Meta<typeof ActivityList>;

const StoryTemplate: StoryFn<typeof ActivityList> = (args) => <ActivityList {...args} />;

export const Default = StoryTemplate.bind({});
Default.args = {
  items: [
    {
      id: 'a',
      type: ActivityType.GOODS,
      status: ActivityStatus.ACTIVE,
      detailURL: '#',
      thumbnailURL:
        'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/iroha_2nd_aniv.webp',
      title: 'あああ',
      startAt: new Date(),
      endAt: new Date(),
      endNote: null,
      isShowTime: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'b',
      detailURL: '#',
      thumbnailURL:
        'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/iroha_2nd_aniv.webp',
      title: 'あああ',
      startAt: new Date(),
      endAt: new Date(),
      createdAt: new Date(),
      endNote: 'end note',
      status: ActivityStatus.ACTIVE,
      type: ActivityType.EVENT,
      updatedAt: new Date(),
      isShowTime: false,
    },
    {
      id: 'c',
      detailURL: '#',
      thumbnailURL:
        'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/iroha_2nd_aniv.webp',
      title: 'あああ',
      startAt: new Date(),
      endAt: new Date(),
      isShowTime: true,
      createdAt: new Date(),
      endNote: 'end note',
      status: ActivityStatus.ACTIVE,
      type: ActivityType.EVENT,
      updatedAt: new Date(),
    },
    {
      id: 'd',
      detailURL: '#',
      thumbnailURL:
        'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/iroha_2nd_aniv.webp',
      title: 'あああ',
      startAt: new Date(),
      endAt: new Date(),
      createdAt: new Date(),
      endNote: 'end note',
      status: ActivityStatus.ACTIVE,
      type: ActivityType.EVENT,
      updatedAt: new Date(),
      isShowTime: false,
    },
  ],
};
