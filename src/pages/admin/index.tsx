import { Button, Typography } from '@mui/material';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import { useCallback, useMemo } from 'react';
import { FaGoogle } from 'react-icons/fa';

import { LinkList } from '../../components/features/admin/LinkList/LinkList';
import { Layout } from '../../components/Layout/Layout';
import { supabase } from '../../utils/supabaseClient';
import styles from './index.module.scss';

const AdminIndexPage = () => {
  const { user } = useUser();

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

  const onLogout = useCallback(() => {
    supabase.auth.signOut();
  }, []);

  if (!user) {
    return (
      <Layout title="admin">
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
