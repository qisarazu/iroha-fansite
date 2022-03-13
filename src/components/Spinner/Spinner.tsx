import styles from './Spinner.module.scss';

type Props = {
  className?: string;
};
export function Spinner({ className }: Props) {
  return <div className={`${styles.root} ${className}`} />;
}
