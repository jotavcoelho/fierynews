import { render, screen } from '@testing-library/react';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { mocked } from 'ts-jest/utils';
import { getPrismicClient } from '../../services/prismic';
import { getSession } from 'next-auth/client';

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post exerpt</p>',
  updatedAt: 'March 10'
}
jest.mock('next-auth/client');
jest.mock('../../services/prismic');

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />)

    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("Post exerpt")).toBeInTheDocument();
  })

  it('redirects user if no subscription is found', async () => {
    const mockedGetSession = mocked(getSession);

    mockedGetSession.mockResolvedValueOnce(null);

    const response = await getServerSideProps({ params: { slug: 'my-new-post'}} as any);
    
    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        }) 
      })
    )
  })

  it('loads initial data', async () => {
    const mockedGetSession = mocked(getSession);

    const mockedGetPrismicClient = mocked(getPrismicClient);

    mockedGetPrismicClient.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My new post' }
          ],
          content: [
            { type: 'paragraph', text: 'Post exerpt'}
          ],
        },
        last_publication_date: '03-10-2021'
      })
    } as any)

    mockedGetSession.mockResolvedValueOnce({
      activeSubscription: 'fakeactivesub'
    } as any);

    const response = await getServerSideProps({ params: { slug: 'my-new-post'}} as any);
    
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post exerpt</p>',
            updatedAt: 'March 10, 2021'
          }
        }
      })
    )
  })
})
