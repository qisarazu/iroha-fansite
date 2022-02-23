import clsx from 'clsx';
import { memo } from 'react';
import { MdRepeat, MdRepeatOne } from 'react-icons/md';
import { IconButton } from '../IconButton/IconButton';
import styles from './RepeatButton.module.scss';
import { useT } from '@transifex/react';

export type RepeatType = 'repeat' | 'repeatOne' | 'none';

type Props = {
  type: RepeatType;
  onClick: (type: RepeatType) => void;
};

export const RepeatButton = memo(({ type, onClick }: Props) => {
  const onClickHandler = () => {
    switch (type) {
      case 'repeat':
        onClick('repeatOne');
        break;
      case 'repeatOne':
        onClick('none');
        break;
      case 'none':
        onClick('repeat');
        break;
    }
  };
  const t = useT();

  return (
    <IconButton
      className={clsx(styles.root, { [styles[type]]: true })}
      aria-label={
        type === 'repeat'
          ? t('プレイリストをリピート', {
              _context: 'The aria-label applied to the button to repeat a whole playlist',
            })
          : type === 'repeatOne'
          ? t('曲をリピート', { _context: 'The aria-label applied to the button to repeat a single track' })
          : t('リピートを解除', { _context: 'The aria-label applied to the button to disable repeating' })
      }
      onClick={onClickHandler}
    >
      {type === 'repeatOne' ? <MdRepeatOne /> : <MdRepeat />}
    </IconButton>
  );
});
