import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MdClear, MdSearch } from 'react-icons/md';
import { Layout } from '../../components/Layout/Layout';
import { SingingStreamMediaObject } from '../../components/SingingStreamMediaObject/SingingStreamMediaObject';
import { Spinner } from '../../components/Spinner/Spinner';
import { useSingingStreamsForSearch } from '../../hooks/singing-stream';
import styles from './index.module.scss';
import { T, useT } from '@transifex/react';

type SearchForm = {
  keyword: string;
};

function SingingStreamsPage() {
  const router = useRouter();
  const { register, handleSubmit, resetField, watch, setValue } = useForm<SearchForm>();
  const { streams } = useSingingStreamsForSearch((router.query.keyword || '') as string);
  const t = useT();

  const onSubmit = useCallback(
    (data: SearchForm) => {
      if (!data.keyword) {
        router.push({ query: {} });
      } else {
        router.push({
          query: { keyword: data.keyword },
        });
      }
    },
    [router],
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

  return (
    <Layout
      title={t('歌枠検索', { _context: 'The page title of the search page' })}
      description={t('風真いろはさんが歌枠等の放送内で歌った曲を検索することが出来ます', {
        _context: 'The meta description of the search page',
      })}
      className={styles.root}
    >
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.searchForm}>
          <input
            className={styles.input}
            placeholder={t('曲名', { _context: 'The placeholder applied to the seach box' })}
            {...register('keyword')}
          />
          {watch().keyword ? (
            <button
              className={styles.reset}
              type="reset"
              aria-label={t('フォームリセット', {
                _context: 'The aria-label applied to the reset button for the stream search form',
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
          aria-label={t('検索', { _context: 'The aria-label applied to the search button' })}
        >
          <MdSearch />
        </button>
      </form>
      <div className={styles.result}>
        {!streams ? (
          <Spinner className={styles.spinner} />
        ) : !streams.length ? (
          <T _str="検索結果はありません" />
        ) : (
          <ul className={styles.list}>
            {streams.map((stream) => (
              <li className={styles.listItem} key={stream.id}>
                <SingingStreamMediaObject singingStream={stream} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

export default SingingStreamsPage;
