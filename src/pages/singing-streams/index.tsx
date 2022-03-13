import { ActionIcon, Center, createStyles, Input, Loader } from '@mantine/core';
import { T, useT } from '@transifex/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MdClear, MdSearch } from 'react-icons/md';

import { Layout } from '../../components/Layout/Layout';
import { SingingStreamMediaObject } from '../../components/SingingStreamMediaObject/SingingStreamMediaObject';
import { useSingingStreamsForSearch } from '../../hooks/singing-stream';
import styles from './index.module.scss';

type SearchForm = {
  keyword: string;
};

const useStyles = createStyles((theme) => ({
  searchInput: {
    flexGrow: 1,
  },
  searchButton: {
    marginLeft: theme.spacing.xs,
  },
}));

function SingingStreamsPage() {
  const { classes } = useStyles();
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
      title={t('歌枠検索', { _context: 'meta', _comment: 'The page title of the search page' })}
      description={t('風真いろはさんが歌枠等の放送内で歌った曲を検索することが出来ます', {
        _context: 'meta',
        _comment: 'The meta description of the search page',
      })}
      className={styles.root}
    >
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('keyword')}
          className={classes.searchInput}
          placeholder={t('曲名', { _context: 'placeholder', _comment: 'The placeholder applied to the seach box' })}
          rightSection={
            watch().keyword ? (
              <ActionIcon
                // className={styles.reset}
                type="reset"
                aria-label={t('フォームリセット', {
                  _context: 'aria-label',
                  _comment: 'The aria-label applied to the reset button for the stream search form',
                })}
                onClick={onReset}
                color="gray"
              >
                <MdClear />
              </ActionIcon>
            ) : null
          }
        />
        <ActionIcon
          className={classes.searchButton}
          variant="filled"
          type="submit"
          size={36}
          aria-label={t('検索', { _context: 'aria-label', _comment: 'The aria-label applied to the search button' })}
        >
          <MdSearch />
        </ActionIcon>
      </form>
      <div className={styles.result}>
        {!streams ? (
          <Center>
            <Loader />
          </Center>
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
