import { ActivatableLink } from '../ActivatableLink';

import { SignInButton } from '../SignInButton';

import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="fierynews" />
        <nav>
          <ActivatableLink activeClassName={styles.active} href="/">
            <a>Home</a>
          </ActivatableLink>
          <ActivatableLink activeClassName={styles.active} href="/posts">
            <a>Posts</a>
          </ActivatableLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}