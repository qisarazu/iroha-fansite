import type PopperJS from '@popperjs/core';
import { memo, useCallback, useState, ComponentPropsWithoutRef } from 'react';
import { MdMoreVert } from 'react-icons/md';
import { usePopper } from 'react-popper';
import { useClickAway } from 'react-use';
import { IconButton } from '../IconButton/IconButton';
import styles from './KebabMenu.module.scss';

type Props = Omit<ComponentPropsWithoutRef<typeof IconButton>, 'className'> & {
  buttonClassName?: string;
  menuClassName?: string;
  placement?: PopperJS.Placement;
  children: React.ReactNode;
};

export const KebabMenu = memo(function KebabMenu({
  buttonClassName,
  menuClassName,
  placement,
  children,
  ...buttonProps
}: Props) {
  const [isOpen, setOpen] = useState(false);

  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const { styles: popperStyles, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    modifiers: [{ name: 'offset', options: { offset: [0, 8] } }, { name: 'flip' }],
  });

  useClickAway({ current: popperElement }, (e) => {
    if (referenceElement?.contains(e.target as Node)) return;
    setOpen(false);
  });

  const onClick = useCallback(() => {
    setOpen((state) => !state);
  }, []);

  return (
    <>
      <IconButton
        {...buttonProps}
        className={`${styles.button} ${buttonClassName}`}
        onClick={onClick}
        ref={setReferenceElement}
      >
        <MdMoreVert color="#ffffff" />
      </IconButton>
      {isOpen ? (
        <div
          className={`${styles.body} ${menuClassName}`}
          style={popperStyles.popper}
          ref={setPopperElement}
          {...attributes.popper}
        >
          {children}
        </div>
      ) : null}
    </>
  );
});
