import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type ComponentPropsWithoutRef, memo } from 'react';

type Props = ComponentPropsWithoutRef<'a'> & {
  href: string;
  activeClassName: string;
};

export const ActiveLink = memo(function ActiveLink({ className, activeClassName, href, ...props }: Props) {
  const { asPath } = useRouter();

  return <Link {...props} href={href} className={clsx(className, { [activeClassName]: asPath === href })}></Link>;
});
