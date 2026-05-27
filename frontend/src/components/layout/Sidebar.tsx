import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    ),
  },
];

const adminItems = [
  {
    to: '/admin',
    label: 'Admin Panel',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
      </svg>
    ),
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();
  const items = isAdmin ? [...navItems, ...adminItems] : navItems;

  const content = (
    <nav className="flex flex-col gap-1 p-3">
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
              isActive
                ? 'bg-accent-muted text-accent font-medium'
                : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
            )
          }
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-52 bg-bg-surface border-r border-border-default min-h-[calc(100vh-3.5rem)]">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          <aside className="fixed left-0 top-14 bottom-0 w-52 bg-bg-surface border-r border-border-default z-50 lg:hidden animate-slide-up">
            {content}
          </aside>
        </>
      )}
    </>
  );
};
