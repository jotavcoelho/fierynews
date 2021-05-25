import Head from 'next/head';

import styles from './home.module.scss'; 

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | fierynews</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all posts <br />
            <span>for $9.90 a month</span>
          </p>
        </section>

        <img src="/images/avatar.svg" alt="Coding girl" />
      </main>
    </>
  )
}
