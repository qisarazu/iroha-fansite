type Props = {
  id: string;
};

/**
 * This component assumes that the useYTPlayer hook is used.
 *
 * @example
 * const { player, ytPlayerProps } = useYTPlayer({ ... });
 * return <YTPlayer {...ytPlayerProps} />
 */
export function YTPlayer({ id }: Props) {
  return <div id={id} />;
}
