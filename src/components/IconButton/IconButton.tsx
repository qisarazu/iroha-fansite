import { ActionIcon, ActionIconProps } from '@mantine/core';
import { cloneElement, forwardRef, memo, ReactElement, useMemo } from 'react';

type Props = ActionIconProps<'button'> & {
  children: ReactElement;
};

export const IconButton = memo(
  forwardRef<HTMLButtonElement, Props>(({ size = 'md', children, ...props }, ref) => {
    const iconSize = useMemo(() => {
      switch (size) {
        case 'xs':
          return 12;
        case 'sm':
          return 14;
        case 'md':
          return 18;
        case 'lg':
          return 26;
        case 'xl':
          return 34;
        default:
          return '1em';
      }
    }, [size]);

    return (
      <ActionIcon {...props} size={size} radius="xl" ref={ref}>
        {cloneElement(children, { size: iconSize })}
      </ActionIcon>
    );
  }),
);
