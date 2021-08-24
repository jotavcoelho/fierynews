import { render, screen } from '@testing-library/react';
import { stripe } from '../../services/stripe';
import Home, { getStaticProps } from '../../pages';
import { mocked } from 'ts-jest/utils';

jest.mock('next/router');
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false]
  }
});

jest.mock('../../services/stripe');

describe('Home page', () => {
  it('renders correctly', () => {
    render(<Home product={{ priceId: 'fake priceId', amount: '$10,00' }} />)

    expect(screen.getByText(/\$10,00/i)).toBeInTheDocument();
  })

  it('loads initial data', async () => {
    const mockedStripePricesRetrieve = mocked(stripe.prices.retrieve);

    mockedStripePricesRetrieve.mockResolvedValueOnce({
      id: 'fakepriceid',
      unit_amount: 1000
    } as any);

    const response = await getStaticProps({});
    
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fakepriceid',
            amount: '$10.00'
          }
        }
      })
    )
  })
})
