import { MantineProvider } from '@mantine/core';
import { tx } from '@transifex/native';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';

import { GlobalStyles } from '../components/GlobalStyles/GlobalStyles';
import { YTPlayerContextProvider } from '../contexts/ytplayer';
import { theme } from '../styles/theme';
import { GA_TRACKING_ID, pageview } from '../utils/gtag';

tx.init({
  token: '1/44aa0ebac5107d9a2a5c8e8555121c52dd9de8cd',
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <YTPlayerContextProvider>
        <GlobalStyles />
        <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `,
          }}
        />
        <Component {...pageProps} />
      </YTPlayerContextProvider>
    </MantineProvider>
  );
}
