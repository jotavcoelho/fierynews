import { render, screen } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { useSession } from 'next-auth/client';
import { SignInButton } from ".";

jest.mock('next-auth/client');

describe('SignInButton component', () => {
  it('renders correctly when user is not logged in', () => {
    const mockedUseSession = mocked(useSession);

    mockedUseSession.mockReturnValueOnce([null, false]);

    render(<SignInButton />)

    expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
  })

  it('renders correctly when user is logged in', () => {
    const mockedUseSession = mocked(useSession);

    mockedUseSession.mockReturnValue([
      { user: {name: 'John Doe', email: 'johndoe@ex.com'}, expires: 'whatever'}, 
      false
    ]);

    render(<SignInButton />)

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  })
})
