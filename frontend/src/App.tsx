import React, { Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AdminRoute } from './components/layout/AdminRoute';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { Spinner } from './components/ui/Spinner';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 flex flex-col overflow-auto">{children}</main>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
  <Provider store={store}>
    <AuthProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen bg-bg-base flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route element={<ProtectedRoute />}>
              <Route
                path="/dashboard"
                element={
                  <AppLayout>
                    <DashboardPage />
                  </AppLayout>
                }
              />
            </Route>

            <Route element={<AdminRoute />}>
              <Route
                path="/admin"
                element={
                  <AppLayout>
                    <AdminPage />
                  </AppLayout>
                }
              />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
        <ToastProvider />
      </BrowserRouter>
    </AuthProvider>
  </Provider>
  </ErrorBoundary>
);

export default App;
