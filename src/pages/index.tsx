import { IconBrandTiktok, IconBrandTwitch, IconBrandX, IconBrandYoutube } from '@tabler/icons-react';
import { T, useT } from '@transifex/react';
import clsx from 'clsx';
import { isAfter, isBefore, parse } from 'date-fns';
import Link from 'next/link';

import { EmojiBackground } from '../components/effects/EmojiBackground/EmojiBackground';
import { IconLink } from '../components/IconLink/IconLink';
import { Layout } from '../components/Layout/Layout';
import styles from './index.module.scss';

function checkDateRange() {
  const startDate = parse('2023/12/02 21:00', 'yyyy/MM/dd HH:mm', new Date());
  const endDate = parse('2023/12/02 22:00', 'yyyy/MM/dd HH:mm', new Date());
  const now = new Date();

  if (isBefore(now, startDate)) {
    return 'before'; // 現在の日時が開始日時より前
  } else if (isAfter(now, endDate)) {
    return 'after'; // 現在の日時が終了日時より後
  } else {
    return 'within'; // 現在の日時が範囲内
  }
}

const status = checkDateRange();

function IndexPage() {
  const t = useT();

  return (
    <Layout
      className={styles.root}
      title={t('ホーム', { _context: 'meta', _comment: 'The page title of the index page' })}
    >
      <EmojiBackground />
      <div className={styles.anniversary}>
        <h1 className={styles.anniversaryTitle}>holoX 2nd ANNIVERSARY LIVE</h1>
        <h2
          className={clsx(styles.anniversaryDate, {
            [styles.anniversaryDateBefore]: status === 'before',
            [styles.anniversaryDateWithin]: status === 'within',
          })}
        >
          {status === 'before' ? (
            '2023/12/02 21:00 START'
          ) : status === 'within' ? (
            <div className={styles.anniversaryDateWithinOnAir}>ON AIR</div>
          ) : (
            ''
          )}
        </h2>

        <div className={styles.live}>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/7R2Q1xjz8eU?si=7Cp-_dPkEP04tccS&controls=0"
            title="【LIVEあり！ゲストあり！】holoXついに◯◯進出！？刮目せよ！我ら #SSholoX2周年"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        </div>
      </div>

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
