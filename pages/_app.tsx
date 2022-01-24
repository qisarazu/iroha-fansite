import type { AppProps } from 'next/app';
import { YTPlayerContextProvider } from '../contexts/ytplayer';
import '../styles/global.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <YTPlayerContextProvider>
      <Component {...pageProps} />
    </YTPlayerContextProvider>
  );
}
