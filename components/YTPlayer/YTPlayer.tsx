type Props = {
  className?: string;
  id: string;
};

/**
 * This component assumes that the useYTPlayer hook is used.
 *
 * @example
 * const { player, ytPlayerProps } = useYTPlayer({ ... });
 * return <YTPlayer {...ytPlayerProps} />
 */
export function YTPlayer({ className, id }: Props) {
  return <div className={className} id={id} />;
}
