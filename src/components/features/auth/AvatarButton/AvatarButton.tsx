import { ActionIcon, Avatar, AvatarProps, Menu } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { User } from '@supabase/supabase-js';
import { IconLogout } from '@tabler/icons-react';
import { useT } from '@transifex/react';
import { useRouter } from 'next/router';
import { mutate, useSWRConfig } from 'swr';

type Props = {
  user: User;
} & AvatarProps;

export function AvatarButton({ user, ...props }: Props) {
  const t = useT();
  const supabase = useSupabaseClient();
  const router = useRouter();

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      notifications.show({ title: 'Error', message: error.message, color: 'red' });
      return;
    }

    // Clear cache
    await mutate((key) => typeof key === 'string' && key.startsWith('/api/playlists'), undefined, {
      revalidate: false,
    });

    router.push('/');
  }

  return (
    <Menu>
      <Menu.Target>
        <Avatar
          {...props}
          component={ActionIcon}
          src={user.user_metadata.avatar_url}
          alt={user.user_metadata.name}
          radius="xl"
        />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item icon={<IconLogout />} onClick={handleSignOut}>
          {t('ログアウト')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
