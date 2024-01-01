import { IconBrandTiktok, IconBrandTwitch, IconBrandX, IconBrandYoutube } from '@tabler/icons-react';
import { T, useT } from '@transifex/react';
import Link from 'next/link';
import { useMemo } from 'react';

import { Information, InformationList } from '../components/features/information/InformationList/InformationList';
import { IconLink } from '../components/IconLink/IconLink';
import { Layout } from '../components/Layout/Layout';
import styles from './index.module.scss';

function IndexPage() {
  const t = useT();

  const informationList = useMemo<Information[]>(
    () => [
      {
        title: '風真いろは 活動2周年記念',
        startAt: new Date(2023, 10, 30, 21, 0),
        endAt: new Date(2024, 0, 4, 18, 0),
        src: 'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/iroha_2nd_aniv.webp',
        href: 'https://shop.hololivepro.com/products/kazamairoha_an2nd',
        showTime: true,
      },
      {
        title: '秘密結社 holoX × ドラマチック謎解きゲーム 〜秘密結社 holoX からの招待状〜 迷宮なラビリンスからの脱出',
        startAt: new Date(2023, 11, 9),
        endAt: new Date(2024, 0, 8),
        src: 'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/labyrinth_of_labyrinth_escape_game.webp',
        href: 'https://www.edith.co.jp/lp/holoX/',
      },
      {
        title: '秘密結社holoX 活動2周年記念',
        startAt: new Date(2023, 11, 2, 22, 0),
        endAt: new Date(2024, 0, 9, 18, 0),
        src: 'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/ssholox_2nd_aniv.webp',
        href: 'https://shop.hololivepro.com/products/holox_an2nd',
        showTime: true,
      },
      {
        title: 'hololive production official shop in Tokyo Station',
        startAt: new Date(2023, 10, 16, 10, 0),
        endAt: new Date(2024, 0, 18, 18, 0),
        src: 'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/tokyo_station_2023.webp',
        href: 'https://hololive.hololivepro.com/events/tokyocs/',
        showTime: true,
      },
      {
        title: 'ほろーかる 京都編 グッズ後日販売',
        startAt: new Date(2023, 11, 20, 12),
        endAt: '',
        src: 'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/holocal_kyoto.webp',
        href: 'https://www.crux-onlinestore.com/shopbrand/ct192/',
        showTime: true,
      },
      {
        title: '【アニメイト】hololive closet 正月衣装',
        startAt: new Date(2024, 0, 1),
        endAt: '',
        src: 'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/closet_newyear_2024.webp',
        href: 'https://twitter.com/animateinfo/status/1737052773743518150',
      },
      {
        title: 'hololive × HoneyWorks（ホロハニ）1stアルバム『ほろはにヶ丘高校』 ゲーマーズ店舗特典',
        startAt: new Date(2023, 11, 15),
        endAt: 'なくなり次第終了',
        src: 'https://rxhqujttltbkuggtavtr.supabase.co/storage/v1/object/public/information-thumbnail/holo_honey_studio_benefit.webp',
        href: 'https://www.gamers.co.jp/pd/10699043/',
      },
    ],
    [],
  );

  return (
    <Layout
      className={styles.root}
      title={t('ホーム', { _context: 'meta', _comment: 'The page title of the index page' })}
    >
      <section>
        <h2 className={styles.informationTitle}>グッズ / イベント情報</h2>
        <main>
          <InformationList items={informationList} />
        </main>
      </section>
      <div className={styles.socialLinks}>
        <div>
          <IconLink
            className={styles.socialLink}
            Icon={IconBrandYoutube}
            href="https://youtube.com/@kazamairoha?si=n5_1qKRF7wGE-Uyl&sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Iroha ch. 風真いろは - holoX -
          </IconLink>
        </div>
        <div>
          <IconLink
            className={styles.socialLink}
            Icon={IconBrandX}
            href="https://x.com/kazamairohach"
            target="_blank"
            rel="noopener noreferrer"
          >
            @kazamairohach
          </IconLink>
        </div>
        <div>
          <IconLink
            className={styles.socialLink}
            Icon={IconBrandTiktok}
            href="https://www.tiktok.com/@kazamairoha_hololive?is_from_webapp=1&sender_device=pc"
            target="_blank"
            rel="noopener noreferrer"
          >
            kazamairoha_hololive
          </IconLink>
        </div>
        <div>
          <IconLink
            className={styles.socialLink}
            Icon={IconBrandTwitch}
            href="https://www.twitch.tv/kazamairoha_holo"
            target="_blank"
            rel="noopener noreferrer"
          >
            kazamairoha_holo
          </IconLink>
        </div>
      </div>

      <p>
        <T
          _str="gozaru.fans はホロライブ6期生 (holoX) の用心棒、風真いろはさんの{unofficial}ファンサイトです。"
          _comment="unofficial: 非公式"
          unofficial={
            <b>
              <T _str="非公式" />
            </b>
          }
        />
      </p>
      <p>
        <T
          _str="詳しくは {aboutUs} をご覧ください。"
          _comment="aboutUs: 当サイトについて"
          aboutUs={
            <Link className={styles.link} href="/about">
              <T _str="当サイトについて" />
            </Link>
          }
        />
      </p>
    </Layout>
  );
}

export default IndexPage;
