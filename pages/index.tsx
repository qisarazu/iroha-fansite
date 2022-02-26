import Link from 'next/link';
import { FaTwitter, FaYoutube } from 'react-icons/fa';
import { IconLink } from '../components/IconLink/IconLink';
import { Layout } from '../components/Layout/Layout';
import styles from './index.module.scss';
import { T, useT } from '@transifex/react';

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
              <Link href="/singing-streams">
                <a className={styles.link}>
                  <T _str="歌枠検索" />
                </a>
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
            <Link href="/about">
              <a className={styles.link}>
                <T _str="当サイトについて" />
              </a>
            </Link>
          }
        />
      </p>
      <div className={styles.socialLinks}>
        <div>
          <IconLink
            className={styles.socialLink}
            Icon={FaYoutube}
            href="https://www.youtube.com/channel/UC_vMYWcDjmfdpH6r4TTn1MQ?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Iroha ch. 風真いろは - holoX -
          </IconLink>
        </div>
        <div>
          <IconLink
            className={styles.socialLink}
            Icon={FaTwitter}
            href="https://twitter.com/kazamairohach"
            target="_blank"
            rel="noopener noreferrer"
          >
            @kazamairohach
          </IconLink>
        </div>
      </div>
    </Layout>
  );
}

export default IndexPage;
