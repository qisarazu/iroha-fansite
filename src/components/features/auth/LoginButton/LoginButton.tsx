import { Button, ButtonProps, Menu } from '@mantine/core';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { IconBrandGoogle, IconBrandTwitter } from '@tabler/icons-react';
import { useT } from '@transifex/react';

type Props = ButtonProps;

export function LoginButton(props: Props) {
  const supabase = useSupabaseClient();
  const t = useT();

  function handleGoogleLogin() {
    supabase.auth.signInWithOAuth({ provider: 'google' });
  }

  function handleTwitterLogin() {
    supabase.auth.signInWithOAuth({ provider: 'twitter' });
  }

  return (
    <Menu>
      <Menu.Target>
        <Button {...props}>{t('ログイン')}</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item icon={<IconBrandGoogle />} onClick={handleGoogleLogin}>
          Google
        </Menu.Item>
        <Menu.Item icon={<IconBrandTwitter />} onClick={handleTwitterLogin}>
          Twitter
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
