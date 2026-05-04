import { forwardRef, memo } from 'react';

type Props = {
  className?: string;
  id: string;
  hidden?: boolean;
};

/**
 * This component assumes that the useYTPlayer hook is used.
 *
 * @example
 * const { player, ytPlayerProps } = useYTPlayer({ ... });
 * return <YTPlayer {...ytPlayerProps} />
 */
const YTPlayerComponent = forwardRef<HTMLDivElement, Props>(({ className, id, hidden = false }, ref) => {
  return <div ref={ref} className={className} id={id} hidden={hidden} />;
});

YTPlayerComponent.displayName = 'YTPlayer';

export const YTPlayer = memo(YTPlayerComponent);
