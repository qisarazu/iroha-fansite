import clsx from 'clsx';
import { memo } from 'react';
import { MdRepeat, MdRepeatOne } from 'react-icons/md';
import { IconButton } from '../IconButton/IconButton';
import styles from './RepeatButton.module.scss';

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

  return (
    <IconButton
      className={clsx(styles.root, { [styles[type]]: true })}
      aria-label={
        type === 'repeat' ? 'プレイリストをリピート' : type === 'repeatOne' ? '曲をリピート' : 'リピートを解除'
      }
      onClick={onClickHandler}
    >
      {type === 'repeatOne' ? <MdRepeatOne /> : <MdRepeat />}
    </IconButton>
  );
});
