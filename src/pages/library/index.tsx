import { Button, Loader } from '@mantine/core';
import { useT } from '@transifex/react';
import Link from 'next/link';

import { useCreatePlaylistModal } from '../../components/features/playlist/CreatePlaylistModal/useCreatePlaylistModal';
import { Layout } from '../../components/Layout/Layout';
import { useGetPlaylists } from '../../hooks/api/playlists/useGetPlaylists';

export default function LibraryIndexPage() {
  const t = useT();
  const { data: playlists, isLoading } = useGetPlaylists();
  const { open } = useCreatePlaylistModal();

  return (
    <Layout title={t('ライブラリ')}>
      {t('ライブラリ')}
      <section>
        <Button onClick={open}>create</Button>
        {isLoading ? (
          <Loader />
        ) : !playlists ? (
          <div>null</div>
        ) : (
          <ul>
            {playlists.map((p) => (
              <li key={p.id}>
                <Link href={`/library/playlists/${p.id}`}>
                  [{p.id}]: {p.title} ({p.description})
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Layout>
  );
}
