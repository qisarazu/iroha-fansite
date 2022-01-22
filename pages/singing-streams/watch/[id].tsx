import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MdRepeat } from 'react-icons/md';
import useSWR from 'swr';
import UrlAssembler from 'url-assembler';
import { YouTubePlayer } from '../../../components/YTPlayer/YTPlayer';
import { useYTPlayer } from '../../../hooks/useYTPlayer';
import { SingingStream } from '../../../types';
import { fetcher } from '../../../utils/fetcher';

function SingingStreamsWatchPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: video } = useSWR<SingingStream>(
    `/api/singing-streams/${id}`,
    fetcher
  );
  const [isRepeat, setRepeat] = useState(false);

  const iframeSrc = useMemo(() => {
    if (!video) return '';
    return UrlAssembler()
      .template('https://www.youtube.com/embed/:videoId')
      .param('videoId', video.id)
      .query({
        enablejsapi: 1,
        start: video.startAt,
        end: video.endAt,
        origin: location.origin,
        widget_referrer: location.origin
      })
      .toString();
  }, [video]);

  const { player, ...YTPlayerProps } = useYTPlayer({
    mountId: 'singing-stream-player',
    url: iframeSrc
  });

  const seekToStartAt = useCallback(() => {
    if (!player || !video) return;

    player.seekTo(video.startAt);
  }, [player, video]);

  const onRepeatClick = useCallback(() => {
    setRepeat((state) => {
      localStorage.setItem('isRepeat', `${!state}`);
      return !state;
    });
  }, []);

  const onStateChange = useCallback(
    (event: { target: YT.Player; data: number }) => {
      // ended
      if (event.data === 0) {
        if (isRepeat) {
          seekToStartAt();
        }
      }

      // playing
      if (event.data === 1) {
        if (video && event.target.getCurrentTime() < video.startAt) {
          seekToStartAt();
        }
      }
    },
    [isRepeat, seekToStartAt, video]
  );

  // initialize watch page
  useEffect(() => {
    setRepeat(localStorage.getItem('isRepeat') === 'true');
  }, []);

  // initialize player
  useEffect(() => {
    if (!player || !video) return;
    console.log(player);
    player.addEventListener('onStateChange', onStateChange);
    return () => {
      player.removeEventListener('onStateChange', onStateChange);
    };
  }, [video, player, onStateChange]);

  if (!video) return <div>loading...</div>;
  return (
    <section>
      <Link href="/singing-streams/search">
        <a>リストに戻る</a>
      </Link>
      <h1>watch</h1>
      <main>
        <YouTubePlayer player={player} {...YTPlayerProps} />
      </main>
      <footer>
        {player ? (
          <div>
            <button onClick={onRepeatClick}>
              <MdRepeat color={isRepeat ? '#000' : '#aaa'} />
            </button>
          </div>
        ) : null}
      </footer>
    </section>
  );
}

export default SingingStreamsWatchPage;
