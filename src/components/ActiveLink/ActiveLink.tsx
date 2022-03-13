import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ComponentPropsWithoutRef, memo } from 'react';

type Props = ComponentPropsWithoutRef<'a'> & {
  href: string;
  activeClassName: string;
};

export const ActiveLink = memo(function ActiveLink({ className, activeClassName, href, ...props }: Props) {
  const { asPath } = useRouter();

  return (
    <Link href={href}>
      <a {...props} className={clsx(className, { [activeClassName]: asPath === href })} href={href} />
    </Link>
  );
});
