import { Alert, Button, ThemeProvider, Typography } from '@mui/material';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { User } from '@supabase/supabase-js';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { FaGoogle } from 'react-icons/fa';

import { LinkList } from '../../components/features/admin/LinkList/LinkList';
import { Layout } from '../../components/Layout/Layout';
import { muiTheme } from '../../styles/theme';
import styles from './index.module.scss';

type Props = {
  user: User | null;
  isAdmin: boolean;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    props: {
      user: session?.user || null,
      isAdmin: session?.user?.id === process.env.ADMIN_UUID,
    },
  };
}

const AdminIndexPage = ({ user, isAdmin }: Props) => {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const redirectUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/admin`;
    }
    return '';
  }, []);

  const onLogin = useCallback(() => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });
  }, [redirectUrl, supabase.auth]);

  const onLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push('/');
  }, [router, supabase.auth]);

  if (!user || !isAdmin) {
    return (
      <ThemeProvider theme={muiTheme}>
        <Layout title="admin">
          <Alert severity="warning">
            このページは管理者専用ページです。管理者アカウントでログインが必要となります。
          </Alert>
          <Button startIcon={<FaGoogle />} onClick={onLogin}>
            Login with Google
          </Button>
        </Layout>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
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
    </ThemeProvider>
  );
};

export default AdminIndexPage;
