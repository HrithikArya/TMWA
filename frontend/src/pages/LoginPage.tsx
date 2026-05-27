import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';

export const LoginPage: React.FC = () => (
  <div className="min-h-screen bg-bg-base flex">
    {/* Brand panel — desktop only */}
    <div className="hidden lg:flex flex-col justify-center items-start w-1/2 px-16 bg-bg-surface border-r border-border-default">
      <div className="max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-lg font-bold text-text-primary">TaskFlow</span>
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-3 leading-tight">
          Organize your work.<br />Ship faster.
        </h1>
        <p className="text-text-secondary text-base leading-relaxed">
          A clean, focused task manager for developers. No noise — just your work.
        </p>
      </div>
    </div>

    {/* Form panel */}
    <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-6">
      <div className="w-full max-w-[440px]">
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            </svg>
          </div>
          <span className="font-bold text-text-primary">TaskFlow</span>
        </div>

        <h2 className="text-xl font-semibold text-text-primary mb-1">Welcome back</h2>
        <p className="text-sm text-text-muted mb-6">Sign in to your account</p>

        <LoginForm />

        <p className="text-sm text-text-muted mt-6 text-center">
          No account?{' '}
          <Link to="/signup" className="text-accent hover:text-accent-hover transition-colors font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  </div>
);
