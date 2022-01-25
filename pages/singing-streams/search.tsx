import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { SingingStreamMediaObject } from '../../components/SingingStreamMediaObject/SingingStreamMediaObject';
import { useSingingStreamsForSearch } from '../../hooks/singing-stream';
import styles from './search.module.scss';
import { MdSearch, MdClear } from 'react-icons/md';
import { Layout } from '../../layout/Layout/Layout';
import { Spinner } from '../../components/Spinner/Spinner';

type SearchForm = {
  keyword: string;
};

function SingingStreamsSearchPage() {
  const router = useRouter();
  const { register, handleSubmit, resetField, formState } =
    useForm<SearchForm>();
  const { streams } = useSingingStreamsForSearch(
    (router.query.keyword || '') as string
  );

  const onSubmit = useCallback(
    (data: SearchForm) => {
      if (!data.keyword) {
        router.push({ query: {} });
      } else {
        router.push({
          query: { keyword: data.keyword }
        });
      }
    },
    [router]
  );

  const onReset = useCallback(() => {
    resetField('keyword');
    router.push({ query: {} });
  }, [resetField, router]);

  return (
    <Layout title="歌枠検索" className={styles.root}>
      <h1 className={styles.title}>歌枠検索</h1>
      <main className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.searchForm}>
            <input
              className={styles.input}
              placeholder="曲名"
              {...register('keyword')}
            />
            {formState.isDirty ? (
              <button className={styles.reset} type="reset" onClick={onReset}>
                <MdClear color="#ffffff" />
              </button>
            ) : null}
          </div>
          <button className={styles.submit} type="submit">
            <MdSearch />
          </button>
        </form>
        <div className={styles.result}>
          {!streams ? (
            <Spinner className={styles.spinner} />
          ) : !streams.length ? (
            <div>empty</div>
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
      </main>
    </Layout>
  );
}

export default SingingStreamsSearchPage;
