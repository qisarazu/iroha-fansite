import { IconBrandTiktok, IconBrandX, IconBrandYoutube } from '@tabler/icons-react';
import { T, useT } from '@transifex/react';
import Link from 'next/link';

import { IconLink } from '../components/IconLink/IconLink';
import { Layout } from '../components/Layout/Layout';
import styles from './index.module.scss';

function IndexPage() {
  const t = useT();
  return (
    <Layout
      className={styles.root}
      title={t('ホーム', { _context: 'meta', _comment: 'The page title of the index page' })}
    >
      <h1 className={styles.title}>gozaru.fans</h1>
      <div className={styles.message}>
        <p>
          <T _str="TOP ページは現在製作中です。" />
        </p>
        <p>
          <T
            _str="{search} をご利用ください !"
            _comment="search: 歌枠検索"
            search={
              <Link className={styles.link} href="/singing-streams">
                <T _str="歌枠検索" />
              </Link>
            }
          />
        </p>
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
      </div>
    </Layout>
  );
}

export default IndexPage;
