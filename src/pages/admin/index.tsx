import { useUser } from '@supabase/supabase-auth-helpers/react';
import { useCallback, useMemo } from 'react';
import { FaGoogle } from 'react-icons/fa';

import { Button } from '../../components/Button/Button';
import { Layout } from '../../components/Layout/Layout';
import { Link } from '../../components/Link/Link';
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
        <Button leftIcon={<FaGoogle />} onClick={onLogin}>
          Login with Google
        </Button>
      </Layout>
    );
  }

  return (
    <Layout title="admin">
      <div className={styles.links}>
        <h2>links</h2>
        <ul>
          <li>
            <Link href="/admin/videos" underline>
              videos
            </Link>
          </li>
        </ul>
      </div>
      <div>Login as: {user.email}</div>
      <Button onClick={onLogout}>Logout</Button>
    </Layout>
  );
};

export default AdminIndexPage;
