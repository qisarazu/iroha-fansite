import { Text, type TextProps } from '@mantine/core';
import { format } from 'date-fns';

type Props = {
  publishedAt: Date | string;
} & TextProps;

export function PublishedAt({ publishedAt, ...props }: Props) {
  return (
    <Text {...props}>
      {format(typeof publishedAt === 'string' ? new Date(publishedAt) : publishedAt, 'yyyy/MM/dd HH:mm')}
    </Text>
  );
}
