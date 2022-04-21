import { Alert, Button, Typography } from '@mui/material';
import getUser from '@supabase/supabase-auth-helpers/nextjs/utils/getUser';
import type { User } from '@supabase/supabase-js';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { FaGoogle } from 'react-icons/fa';

import { LinkList } from '../../components/features/admin/LinkList/LinkList';
import { Layout } from '../../components/Layout/Layout';
import { supabase } from '../../utils/supabaseClient';
import styles from './index.module.scss';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { user } = await getUser(ctx);
  return {
    props: {
      user,
      isAdmin: user?.id === process.env.ADMIN_UUID,
    },
  };
}

const AdminIndexPage = ({ user, isAdmin }: { user: User; isAdmin: boolean }) => {
  const router = useRouter();

  const redirectUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/admin`;
    }
    return '';
  }, []);

  const onLogin = useCallback(() => {
    supabase.auth.signIn(
      {
        provider: 'google',
      },
      {
        redirectTo: redirectUrl,
      },
    );
  }, [redirectUrl]);

  const onLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.reload();
  }, [router]);

  if (!isAdmin || !user) {
    return (
      <Layout title="admin">
        <Alert severity="warning">このページは管理者専用ページです。管理者アカウントでログインが必要となります。</Alert>
        <Button startIcon={<FaGoogle />} onClick={onLogin}>
          Login with Google
        </Button>
      </Layout>
    );
  }

  return (
    <Layout title="admin">
      <div className={styles.links}>
        <Typography variant="subtitle1">links</Typography>
        <LinkList />
      </div>
      <Typography sx={{ my: 1 }}>Login as: {user.email}</Typography>
      <Button variant="outlined" startIcon={<FaGoogle />} onClick={onLogout}>
        Logout
      </Button>
    </Layout>
  );
};

export default AdminIndexPage;
