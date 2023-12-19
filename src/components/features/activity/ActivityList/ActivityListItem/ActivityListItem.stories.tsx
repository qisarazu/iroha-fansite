import type { Meta, StoryFn } from '@storybook/react';
import { addDays } from 'date-fns';

import { ActivityListItem } from './ActivityListItem';

export default {
  title: 'components/features/activity/ActivityList/ActivityListItem',
  component: ActivityListItem,
} as Meta<typeof ActivityListItem>;

const StoryTemplate: StoryFn<typeof ActivityListItem> = (args) => <ActivityListItem {...args} />;

export const SquareImage = StoryTemplate.bind({});
SquareImage.args = {
  thumbnailURL:
    'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/iroha_2nd_aniv.webp',
  detailURL: 'https://shop.hololivepro.com/products/kazamairoha_an2nd',
  title: '風真いろは 活動2周年記念',
  startAt: new Date(2023, 10, 30, 21, 0),
  endAt: new Date(2024, 0, 4, 18, 0),
  isShowTime: true,
};

export const SquareImageLongTitle = StoryTemplate.bind({});
SquareImageLongTitle.args = {
  thumbnailURL:
    'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/iroha_2nd_aniv.webp',
  detailURL: 'https://shop.hololivepro.com/products/kazamairoha_an2nd',
  title:
    'とても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトル',
  startAt: new Date(2023, 10, 30, 21, 0),
  endAt: new Date(2024, 0, 4, 18, 0),
  isShowTime: true,
};

export const LandscapeImage = StoryTemplate.bind({});
LandscapeImage.args = {
  thumbnailURL:
    'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/holocal_kyoto.webp',
  title: 'ほろ～かる京都編',
  startAt: new Date(2023, 11, 7, 0, 0),
  endAt: new Date(2023, 11, 19, 0, 0),
};

export const LandscapeImageLongTitle = StoryTemplate.bind({});
LandscapeImageLongTitle.args = {
  thumbnailURL:
    'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/holocal_kyoto.webp',
  title:
    'とても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトル',
  startAt: new Date(2023, 10, 30, 21, 0),
  endAt: new Date(2024, 0, 4, 18, 0),
  isShowTime: true,
};

export const EndAtIsNearly = StoryTemplate.bind({});
EndAtIsNearly.args = {
  thumbnailURL:
    'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/iroha_2nd_aniv.webp',
  title: '風真いろは 活動2周年記念',
  startAt: new Date(),
  endAt: addDays(new Date(), 3),
  isShowTime: true,
};

export const EndNote = StoryTemplate.bind({});
EndNote.args = {
  thumbnailURL:
    'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/iroha_2nd_aniv.webp',
  title: '風真いろは 活動2周年記念',
  startAt: new Date(),
  endNote: 'なくなり次第終了',
};
