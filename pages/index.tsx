import Link from 'next/link';
import { FaTwitter, FaYoutube } from 'react-icons/fa';
import { IconLink } from '../components/IconLink/IconLink';
import { Layout } from '../components/Layout/Layout';
import styles from './index.module.scss';

function IndexPage() {
  return (
    <Layout className={styles.root} title="ホーム">
      <h1 className={styles.title}>gozaru.fans</h1>
      <div className={styles.message}>
        <p>TOP ページは現在製作中です。</p>
        <p>
          <Link href="/singing-streams/search">
            <a className={styles.link}>歌枠検索</a>
          </Link>{' '}
          をご利用ください !
        </p>
      </div>
      <p>
        gozaru.fans はホロライブ6期生 (holoX) の用心棒、風真いろはさんの<b>非公式</b>ファンサイトです。
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
