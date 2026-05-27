import { type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

const Wrapper = ({
  children,
  initialEntries = ['/'],
}: {
  children: ReactNode;
  initialEntries?: string[];
}) => (
  <Provider store={store}>
    <AuthProvider>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </AuthProvider>
  </Provider>
);

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('redirects unauthenticated user to /login', () => {
    render(
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>Protected Content</div>} />
        </Route>
      </Routes>,
      { wrapper: ({ children }) => <Wrapper initialEntries={['/']}>{children}</Wrapper> }
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders protected content for authenticated user', () => {
    localStorage.setItem('tf_token', 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImV4cCI6OTk5OTk5OTk5OX0.signature');
    localStorage.setItem('tf_user', JSON.stringify({ _id: '1', name: 'Test', email: 'test@example.com', role: 'user' }));

    render(
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>Protected Content</div>} />
        </Route>
      </Routes>,
      { wrapper: ({ children }) => <Wrapper initialEntries={['/']}>{children}</Wrapper> }
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
