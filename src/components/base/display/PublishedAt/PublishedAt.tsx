import { Text, type TextProps } from '@mantine/core';
import { useT } from '@transifex/react';
import { format } from 'date-fns';

type Props = {
  publishedAt: Date | string;
  live?: boolean;
} & TextProps;

export function PublishedAt({ publishedAt, live = false, ...props }: Props) {
  const t = useT();
  const label = live ? t('配信') : t('投稿');
  return (
    <Text {...props}>
      {format(typeof publishedAt === 'string' ? new Date(publishedAt) : publishedAt, `yyyy/MM/dd ${label}`)}
    </Text>
  );
}
