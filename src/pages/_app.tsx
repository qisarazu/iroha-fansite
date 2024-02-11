import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '../styles/global.scss';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications, notifications } from '@mantine/notifications';
import { createPagesBrowserClient, type Session } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { tx } from '@transifex/native';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { Revalidator, RevalidatorOptions, SWRConfig, SWRConfiguration } from 'swr';

import { YTPlayerContextProvider } from '../contexts/ytplayer';
import { ApiError, unauthorized } from '../lib/api/ApiError';
import { theme } from '../styles/theme';
import { GA_TRACKING_ID, pageview } from '../utils/gtag';

tx.init({
  token: '1/44aa0ebac5107d9a2a5c8e8555121c52dd9de8cd',
});

export default function MyApp({ Component, pageProps }: AppProps<{ initialSession: Session }>) {
  const router = useRouter();
  const [supabase] = useState(() => createPagesBrowserClient());

  function handleError(error: ApiError) {
    notifications.show({ title: 'Error', message: error.message, color: 'red' });
  }

  function handleErrorRetry(
    error: ApiError,
    _key: string,
    config: SWRConfiguration,
    revalidate: Revalidator,
    { retryCount }: RevalidatorOptions,
  ) {
    if (error.statusCode === unauthorized().statusCode) return;
    if (retryCount && retryCount >= 5) return;

    setTimeout(() => revalidate({ retryCount }), config.errorRetryInterval);
  }

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
    <SWRConfig value={{ onError: handleError, onErrorRetry: handleErrorRetry }}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <ModalsProvider>
          <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
            <YTPlayerContextProvider>
              <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
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
              <Notifications position="bottom-left" />
            </YTPlayerContextProvider>
          </SessionContextProvider>
        </ModalsProvider>
      </MantineProvider>
    </SWRConfig>
  );
}
