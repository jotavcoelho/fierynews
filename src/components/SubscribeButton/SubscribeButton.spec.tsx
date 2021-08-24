import { render, screen, fireEvent } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { SubscribeButton } from ".";

jest.mock('next-auth/client');
jest.mock('next/router')

describe('SubscribeButton component', () => {
  it('renders correctly', () => {
    const mockedUseSession = mocked(useSession);

    mockedUseSession.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />)

    expect(screen.getByText('Subscribe Now')).toBeInTheDocument();
  })

  it('redirects user to signIn when not authenticated', () => {
    const mockedSignIn = mocked(signIn);
    const mockedUseSession = mocked(useSession);

    mockedUseSession.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe Now');

    fireEvent.click(subscribeButton);

    expect(mockedSignIn).toHaveBeenCalled();
  })

  it('redirects to posts when user already has a subscription', () => {
    const mockedUseRouter = mocked(useRouter);
    const mockedUseSession = mocked(useSession);
    const mockedPush = jest.fn();

    mockedUseSession.mockReturnValueOnce([
      { 
        user: {
          name: 'John Doe', 
          email: 'johndoe@ex.com'
        }, 
        activeSubscription: 'letspretendtheyhaveit',
        expires: 'whatever'
      }, 
      false
    ]);
    
    mockedUseRouter.mockReturnValueOnce({
      push: mockedPush,
    } as any)

    const { debug } = render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe Now');

    fireEvent.click(subscribeButton);
    // debug();
    expect(mockedPush).toHaveBeenCalledWith('/posts');
  })
})

