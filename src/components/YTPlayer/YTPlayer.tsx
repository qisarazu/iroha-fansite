import { memo } from 'react';

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
export const YTPlayer = memo(({ className, id, hidden = false }: Props) => {
  return <div className={className} id={id} hidden={hidden} />;
});
