import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MdClear, MdSearch } from 'react-icons/md';
import { Layout } from '../../components/Layout/Layout';
import { SingingStreamMediaObject } from '../../components/SingingStreamMediaObject/SingingStreamMediaObject';
import { Spinner } from '../../components/Spinner/Spinner';
import { useSingingStreamsForSearch } from '../../hooks/singing-stream';
import styles from './search.module.scss';

type SearchForm = {
  keyword: string;
};

function SingingStreamsSearchPage() {
  const router = useRouter();
  const { register, handleSubmit, resetField, watch, setValue } = useForm<SearchForm>();
  const { streams } = useSingingStreamsForSearch((router.query.keyword || '') as string);

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
      title="歌枠検索"
      description="風真いろはさんが歌枠等の放送内で歌った曲を検索することが出来ます"
      className={styles.root}
    >
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.searchForm}>
          <input className={styles.input} placeholder="曲名" {...register('keyword')} />
          {watch().keyword ? (
            <button className={styles.reset} type="reset" aria-label='フォームリセット' onClick={onReset}>
              <MdClear color="#ffffff" />
            </button>
          ) : null}
        </div>
        <button className={styles.submit} type="submit" aria-label="検索">
          <MdSearch />
        </button>
      </form>
      <div className={styles.result}>
        {!streams ? (
          <Spinner className={styles.spinner} />
        ) : !streams.length ? (
          <div>検索結果はありません</div>
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

export default SingingStreamsSearchPage;
