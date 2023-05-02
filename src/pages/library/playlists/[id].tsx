import type { Playlist } from '@prisma/client';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { GetServerSideProps } from 'next';

import { Layout } from '../../../components/Layout/Layout';

export const getServerSideProps: GetServerSideProps<{ playlist: Playlist }> = async (context) => {
  const { id } = context.params as { id: string };

  const supabase = createServerSupabaseClient(context);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: '/library',
        permanent: false,
      },
    };
  }

  const item = await prisma.playlist.findFirst({
    where: {
      id,
      ownerId: session.user.id,
    },
  });

  if (!item) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      playlist: JSON.stringify(item),
    },
  };
};

export default function PlaylistIdPage({ playlist: _p }: { playlist: string }) {
  const playlist = JSON.parse(_p);
  return (
    <Layout title={playlist.title}>
      <h1>{playlist.title}</h1>
    </Layout>
  );
}
