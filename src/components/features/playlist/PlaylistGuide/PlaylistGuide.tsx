import { IconDotsVertical, IconPlaylistAdd } from '@tabler/icons-react';
import clsx from 'clsx';
import Image from 'next/image';

import styles from './PlaylistGuide.module.css';

type Props = {
  className?: string;
};

export function PlaylistGuide({ className }: Props) {
  return (
    <div className={clsx(styles.root, className)}>
      <p>
        アイテムをプレイリストに追加するには、検索ページや視聴ページにある曲の3点メニュー「
        <IconDotsVertical size="1em" />
        」から「 <IconPlaylistAdd size="1em" /> プレイリストに追加 」を選択してください。
      </p>
      <Image
        className={styles.image}
        src="/how-to-add-playlist-item.png"
        alt="How to add playlist item."
        width={618}
        height={253}
      />
    </div>
  );
}
