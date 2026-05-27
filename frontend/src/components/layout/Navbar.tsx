import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDarkMode } from '@/hooks/useDarkMode';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 h-14 bg-bg-surface border-b border-border-default flex items-center px-4 gap-3">
      <button
        className="lg:hidden p-2 rounded-md hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors"
        onClick={onMenuClick}
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-text-primary mr-4">
        <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
        <span className="hidden sm:block">TaskFlow</span>
      </Link>

      <div className="flex-1" />

      {isAdmin && (
        <Link
          to="/admin"
          className="text-xs font-medium text-accent hover:text-accent-hover transition-colors hidden sm:block"
        >
          Admin Panel
        </Link>
      )}

      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-md hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors"
        aria-label="Toggle dark mode"
      >
        {isDark ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <div className="flex items-center gap-2 border-l border-border-default pl-3 ml-1">
        <span className="text-sm text-text-secondary hidden sm:block">
          {user?.name}
        </span>
        <Button variant="ghost" onClick={handleLogout} className="text-xs px-3 py-1.5">
          Logout
        </Button>
      </div>
    </header>
  );
};
