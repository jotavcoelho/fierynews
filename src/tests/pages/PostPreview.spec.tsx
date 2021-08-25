import { render, screen } from '@testing-library/react';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { mocked } from 'ts-jest/utils';
import { getPrismicClient } from '../../services/prismic';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post exerpt</p>',
  updatedAt: 'March 10'
}
jest.mock('next-auth/client'); 
jest.mock('next/router'); 
jest.mock('../../services/prismic');

describe('Post preview page', () => {
  it('renders correctly', () => {
    const mockedUseSession = mocked(useSession);

    mockedUseSession.mockReturnValueOnce([null, false])

    render(<Post post={post} />)

    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("Post exerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna keep reading?")).toBeInTheDocument();
  })

  it('redirects user to full post if theres a subscription', async () => {
    const mockedUseSession = mocked(useSession);
    const mockedUseRouter = mocked(useRouter);

    const mockedPush = jest.fn();

    mockedUseSession.mockReturnValueOnce([
      { activeSubscription: 'fakeactivesub' },
      false
    ]);

    mockedUseRouter.mockReturnValueOnce({
      push: mockedPush,
    } as any);

    render(<Post post={post} />)
    
    expect(mockedPush).toHaveBeenCalledWith('/posts/my-new-post')
  })

  it('loads initial data', async () => {
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

    const response = await getStaticProps({ params: { slug: 'my-new-post'}} as any);
    
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
