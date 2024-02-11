import { ColorSchemeScript } from '@mantine/core';
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <link rel="icon" sizes="32x32" href="/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700&family=Nunito:wght@400;700&display=swap"
            rel="stylesheet"
          />
          <ColorSchemeScript defaultColorScheme="dark" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
