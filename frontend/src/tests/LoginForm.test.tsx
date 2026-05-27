import { type ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { AuthProvider } from '@/context/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';

const Wrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>
    <AuthProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </AuthProvider>
  </Provider>
);

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm />, { wrapper: Wrapper });
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation error when email is empty', async () => {
    const user = userEvent.setup();
    render(<LoginForm />, { wrapper: Wrapper });

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/valid email required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error when password is empty', async () => {
    const user = userEvent.setup();
    render(<LoginForm />, { wrapper: Wrapper });

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/password required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<LoginForm />, { wrapper: Wrapper });

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.queryByText(/valid email required/i)).not.toBeInTheDocument();
    });
  });
});
