import { render, screen } from '@testing-library/react';
import Posts, { getStaticProps } from '../../pages/posts';
import { mocked } from 'ts-jest/utils';
import { getPrismicClient } from '../../services/prismic';

const posts = [{
  slug: 'my-new-post',
  title: 'My New Post',
  exerpt: 'Post exerpt',
  updatedAt: 'March 10'
}]

jest.mock('../../services/prismic');

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText("My New Post")).toBeInTheDocument();
  })

  it('loads initial data', async () => {
    const mockedGetPrismicClient = mocked(getPrismicClient);

    mockedGetPrismicClient.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [
                { type: 'heading', text: 'My new post' }
              ],
              content: [
                { type: 'paragraph', text: 'Post exerpt'}
              ],
            },
            last_publication_date: '03-10-2021'
          }
        ]
      })
    } as any);

    const response = await getStaticProps({});
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-new-post',
            title: 'My new post',
            exerpt: 'Post exerpt',
            updatedAt: 'March 10, 2021'
          }]
        }
      })
    )
  })
})
