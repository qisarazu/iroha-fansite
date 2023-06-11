import { Button, ButtonProps } from '@mantine/core';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useT } from '@transifex/react';

type Props = ButtonProps;

export function LoginButton(props: Props) {
  const supabase = useSupabaseClient();
  const t = useT();

  function handleLogin() {
    supabase.auth.signInWithOAuth({ provider: 'google' });
  }

  return (
    <Button {...props} onClick={handleLogin}>
      {t('ログイン')}
    </Button>
  );
}
