import { render, screen } from '@testing-library/react';
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
    render(
      <ActivatableLink href="/" activeClassName="active">
        <a>Home</a>
      </ActivatableLink>
    );
  
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
  
  it('has active class if it should', () => {
    render(
      <ActivatableLink href="/" activeClassName="active">
        <a>Home</a>
      </ActivatableLink>
    );
  
    expect(screen.getByText('Home')).toHaveClass('active');
  });
});
