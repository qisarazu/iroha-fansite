import type { Meta, StoryFn } from '@storybook/react';
import { addDays } from 'date-fns';

import { InformationListItem } from './InformationListItem';

export default {
  title: 'components/features/information/InformationList/InformationListItem',
  component: InformationListItem,
} as Meta<typeof InformationListItem>;

const StoryTemplate: StoryFn<typeof InformationListItem> = (args) => <InformationListItem {...args} />;

export const SquareImage = StoryTemplate.bind({});
SquareImage.args = {
  src: 'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/iroha_2nd_aniv.webp',
  href: 'https://shop.hololivepro.com/products/kazamairoha_an2nd',
  title: '風真いろは 活動2周年記念',
  startAt: new Date(2023, 10, 30, 21, 0),
  endAt: new Date(2024, 0, 4, 18, 0),
  showTime: true,
};

export const SquareImageLongTitle = StoryTemplate.bind({});
SquareImageLongTitle.args = {
  src: 'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/iroha_2nd_aniv.webp',
  href: 'https://shop.hololivepro.com/products/kazamairoha_an2nd',
  title:
    'とても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトル',
  startAt: new Date(2023, 10, 30, 21, 0),
  endAt: new Date(2024, 0, 4, 18, 0),
  showTime: true,
};

export const LandscapeImage = StoryTemplate.bind({});
LandscapeImage.args = {
  src: 'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/holocal_kyoto.webp',
  title: 'ほろ～かる京都編',
  startAt: new Date(2023, 11, 7, 0, 0),
  endAt: new Date(2023, 11, 19, 0, 0),
};

export const LandscapeImageLongTitle = StoryTemplate.bind({});
LandscapeImageLongTitle.args = {
  src: 'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/holocal_kyoto.webp',
  title:
    'とても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトルとても長いタイトル',
  startAt: new Date(2023, 10, 30, 21, 0),
  endAt: new Date(2024, 0, 4, 18, 0),
  showTime: true,
};

export const EndAtIsNearly = StoryTemplate.bind({});
EndAtIsNearly.args = {
  src: 'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/iroha_2nd_aniv.webp',
  title: '風真いろは 活動2周年記念',
  startAt: new Date(),
  endAt: addDays(new Date(), 8),
  showTime: true,
};
