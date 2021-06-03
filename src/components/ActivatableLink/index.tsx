import { useRouter } from "next/dist/client/router";
import Link, { LinkProps } from "next/link";
import { ReactElement, cloneElement } from "react";

interface ActivatableLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export function ActivatableLink({ children, activeClassName, ...rest }: ActivatableLinkProps) {
  const { asPath } = useRouter();

  const className = asPath === rest.href
    ? activeClassName
    : '';

  return (
    <Link {...rest}>
      {cloneElement(children, {
        className,
      })}
    </Link>
  )
}