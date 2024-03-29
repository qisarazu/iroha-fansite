import { Center, Loader } from '@mantine/core';
import { T, useT } from '@transifex/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MdClear, MdSearch } from 'react-icons/md';
import { useInView } from 'react-intersection-observer';

import { MusicMediaObject } from '../../components/features/music/MusicMediaObject/MusicMediaObject';
import { Layout } from '../../components/Layout/Layout';
import { useGetSingingStreamsApi } from '../../hooks/api/singing-streams/useGetSingingStreamsApi';
import styles from './index.module.scss';

type Query = {
  keyword?: string;
};

type SearchForm = {
  keyword: string;
};

function SingingStreamsPage() {
  const t = useT();
  const router = useRouter();
  const { keyword } = router.query as Query;
  const { register, handleSubmit, resetField, watch, setValue } = useForm<SearchForm>();
  const { ref: inviewRef, inView } = useInView();

  const {
    data: singingStreams,
    isLoading,
    isValidating,
    hasNext,
    setSize,
  } = useGetSingingStreamsApi({ request: { keyword } });

  const onSubmit = useCallback(
    (data: SearchForm) => {
      if (!data.keyword) {
        router.push({ query: {} });
      } else {
        router.push({
          query: { keyword: data.keyword },
        });
        setSize(1);
      }
    },
    [router, setSize],
  );

  const onReset = useCallback(() => {
    resetField('keyword');
    router.push({ query: {} });
  }, [resetField, router]);

  useEffect(() => {
    if (router.query.keyword && typeof router.query.keyword === 'string') {
      setValue('keyword', router.query.keyword);
    }
  }, [router.query.keyword, setValue]);

  if (inView && !isValidating && hasNext) {
    setSize((size) => size + 1);
  }

  return (
    <Layout
      title={t('歌枠検索', { _context: 'meta', _comment: 'The page title of the search page' })}
      description={t('風真いろはさんが歌枠等の放送内で歌った曲を検索することが出来ます', {
        _context: 'meta',
        _comment: 'The meta description of the search page',
      })}
      className={styles.root}
    >
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.searchForm}>
          <input
            className={styles.input}
            placeholder={t('曲名', { _context: 'placeholder', _comment: 'The placeholder applied to the seach box' })}
            {...register('keyword')}
          />
          {watch().keyword ? (
            <button
              className={styles.reset}
              type="reset"
              aria-label={t('フォームリセット', {
                _context: 'aria-label',
                _comment: 'The aria-label applied to the reset button for the stream search form',
              })}
              onClick={onReset}
            >
              <MdClear color="#ffffff" />
            </button>
          ) : null}
        </div>
        <button
          className={styles.submit}
          type="submit"
          aria-label={t('検索', { _context: 'aria-label', _comment: 'The aria-label applied to the search button' })}
        >
          <MdSearch />
        </button>
      </form>
      <div className={styles.result}>
        {!singingStreams || isLoading ? (
          <Center mt={48}>
            <Loader size="xl" />
          </Center>
        ) : !singingStreams.length ? (
          <T _str="検索結果はありません" />
        ) : (
          <ul className={styles.list}>
            {singingStreams.map((singingStream) => (
              <li className={styles.listItem} key={singingStream.id}>
                <MusicMediaObject singingStream={singingStream} />
              </li>
            ))}
            {hasNext && !isValidating ? <li ref={inviewRef} /> : null}
          </ul>
        )}
        {!isLoading && isValidating ? (
          <Center mt={48}>
            <Loader size="xl" />
          </Center>
        ) : null}
      </div>
    </Layout>
  );
}

export default SingingStreamsPage;
