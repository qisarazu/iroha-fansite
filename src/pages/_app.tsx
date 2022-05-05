import '../styles/global.scss';

import { ThemeProvider } from '@mui/material/styles';
import { UserProvider } from '@supabase/supabase-auth-helpers/react';
import { tx } from '@transifex/native';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';

import { YTPlayerContextProvider } from '../contexts/ytplayer';
import { supabase } from '../lib/supabase';
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
    <ThemeProvider theme={theme}>
      <UserProvider supabaseClient={supabase}>
        <YTPlayerContextProvider>
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
      </UserProvider>
    </ThemeProvider>
  );
}
