import { render } from '@testing-library/react';
import { ActivatableLink } from '.';

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

describe('ActivatableLink component', () => {
  it('renders successfully', () => {
    const { getByText } = render(
      <ActivatableLink href="/" activeClassName="active">
        <a>Home</a>
      </ActivatableLink>
    );
  
    expect(getByText('Home')).toBeInTheDocument();
  });
  
  it('has active class if it should', () => {
    const { getByText } = render(
      <ActivatableLink href="/" activeClassName="active">
        <a>Home</a>
      </ActivatableLink>
    );
  
    expect(getByText('Home')).toHaveClass('active');
  });
});
