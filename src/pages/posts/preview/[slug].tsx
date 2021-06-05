import { GetStaticPaths, GetStaticProps } from "next"
import { useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import Head from 'next/head';
import Link from 'next/link';
import { RichText } from "prismic-dom";
import { useEffect } from "react";

import { getPrismicClient } from "../../../services/prismic";

import styles from '../post.module.scss';

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`); 
    }
  }, [session])

  return (
    <>
      <Head>
        <title>{post.title} | Fierynews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div 
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
          <div className={styles.continueReading}>
            Want to continue reading?
            <Link href='/'>
              <a>Subscribe now</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => { // this what lets us decide what pages we want to generate during build
  return {
    paths: [], // we put their paths here, it's empty cuz we don't want any of them to be preloaded
    fallback: 'blocking',
      // this thing can receive true, false and 'blocking'
      // true
        // if the user accesses a page without it being prerendered, it'll load it client-side, which is a no-no
      // false
        // if the post wasn't statically generated yet, returns a 404
      // 'blocking'
        // the ideal, when it wasn't generated yet, it tries to do it on the serverside
  }
}

// getstaticpaths can only be used on these dynamic pages (with [these] on their filename)

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 30, // 30mins
  }
}
