import type { ReactNode } from 'react';
import { FaTwitter, FaGithub } from 'react-icons/fa';
import { ExternalLink } from '../../components/ExternalLink/ExternalLink';
import { IconLink } from '../../components/IconLink/IconLink';
import { Layout } from '../../components/Layout/Layout';
import styles from './index.module.scss';
import { T, useT } from '@transifex/react';

function AboutPage() {
  const t = useT();
  return (
    <Layout
      className={styles.root}
      title={t('当サイトについて', { _context: 'meta', _comment: 'The page title of the about page' })}
    >
      <h1 className={styles.title}>
        <T _str="当サイトについて" />
      </h1>
      <p>
        <T
          _str="gozaru.fans (以下、当サイト) はホロライブ6期生 (holoX) の用心棒、風真いろはさんの{unofficial}
        ファンサイトです。"
          _comment="unofficial: 非公式"
          unofficial={
            <b>
              <T _str="非公式" />
            </b>
          }
        />
      </p>
      <p>
        <T _str="カバー株式会社様、およびホロライブプロダクション、その他関係者とは⼀切関係ありません。" />
      </p>
      <section className={styles.section}>
        <h2 className={styles.subtitle}>
          <T _str="免責事項" />
        </h2>
        <p>
          <T _str="当サイトは著作権や肖像権の侵害を目的としたものではありません。当サイトで掲載している画像の著作権や肖像権等は、各権利所有者に帰属します。" />
        </p>
        <p>
          <T
            _str="著作権や肖像権に関して問題がございましたら、{contactForm} よりご連絡ください。迅速に対応いたします。"
            _comment="contactForm: お問い合わせフォーム"
            contactForm={
              <ContactFormLink>
                <T _str="お問い合わせフォーム" />
              </ContactFormLink>
            }
          />
        </p>
        <p>
          <T _str="当サイトのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。" />
        </p>
        <p>
          <T _str="当サイトからのリンクやバナーなどで移動したサイトで提供される情報、サービス等について一切の責任を負いません。" />
        </p>
        <p>
          <T _str="当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。" />
        </p>
      </section>
      <section className={styles.section}>
        <h2 className={styles.subtitle}>
          <T _str="アクセス解析について" />
        </h2>
        <p>
          <T _str="当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。このGoogleアナリティクスはデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。" />
        </p>
        <p>
          <T _str="ブラウザの設定にて、Cookie（クッキー）を無効にすることにより、Cookie（クッキー）を利用したデータ収集を無効にすることが可能です。" />
        </p>
      </section>
      <section className={styles.section}>
        <h2 className={styles.subtitle}>
          <T _str="当サイト上でのYouTube動画の再生について" />
        </h2>
        <p>
          <T _str="当サイトでは、YouTube から提供されている IFrame Player API を利用し、すべて元動画を再生しています。" />
        </p>
        <ExternalLink className={styles.link} href="https://developers.google.com/youtube/iframe_api_reference">
          IFrame API reference
        </ExternalLink>
      </section>
      <section className={styles.contact}>
        <h2 className={styles.subtitle}>
          <T _str="お問い合わせ" />
        </h2>
        <p>
          <T
            _str="こちらの {contactForm} よりお問い合わせください。"
            _comment="contactForm: お問い合わせフォーム"
            contactForm={
              <ContactFormLink>
                <T _str="お問い合わせフォーム" />
              </ContactFormLink>
            }
          />
        </p>
      </section>
      <section>
        <h2 className={styles.subtitle}>
          <T _str="製作者" />
        </h2>
        <div className={styles.developer}>
          きさらず (@qisarazu)
          <IconLink
            className={styles.iconLink}
            Icon={FaTwitter}
            href="https://twitter.com/qisarazu"
            target="_blank"
            rel="noopener noreferrer"
          ></IconLink>
          <IconLink
            className={styles.iconLink}
            Icon={FaGithub}
            href="https://github.com/qisarazu"
            target="_blank"
            rel="noopener noreferrer"
          ></IconLink>
        </div>
      </section>
      <section>
        <h2 className={styles.subtitle}>
          <T _str="ソースコード" />
        </h2>
        <p>
          <T _str="当サイトのソースコードはオープンソースとして GitHub 上に公開しています。" />
        </p>
        <ExternalLink className={styles.link} href="https://github.com/qisarazu/iroha-fansite">
          https://github.com/qisarazu/iroha-fansite
        </ExternalLink>
      </section>
    </Layout>
  );
}

const ContactFormLink = ({ children }: { children: ReactNode }) => (
  <ExternalLink className={styles.link} href="https://forms.gle/JPgpV1do2GgiPWhE9">
    {children}
  </ExternalLink>
);

export default AboutPage;
