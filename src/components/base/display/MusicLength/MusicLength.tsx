import { Text, type TextProps } from '@mantine/core';
import { intervalToDuration } from 'date-fns';

type Props = {
  start: number;
  end: number;
} & TextProps;

export function MusicLength({ start, end, ...props }: Props) {
  const { minutes, seconds } = intervalToDuration({ start: 0, end: (end - start) * 1000 });
  return (
    <Text {...props}>
      {minutes?.toString().padStart(2, '0')}:{seconds?.toString().padStart(2, '0')}
    </Text>
  );
}
