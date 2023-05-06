import { Avatar, AvatarProps } from '@mantine/core';
import type { User } from '@supabase/auth-helpers-react';

type Props = {
  user: User;
} & AvatarProps;

export function UserIcon({ user, ...props }: Props) {
  return <Avatar {...props} src={user.user_metadata.avatar_url} alt={user.user_metadata.name} radius="xl" />;
}
