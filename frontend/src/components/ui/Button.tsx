import React from 'react';
import { cn } from '@/utils/cn';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-accent hover:bg-accent-hover text-white font-medium px-4 py-2 rounded-md transition-colors',
  ghost:
    'bg-transparent hover:bg-bg-elevated text-text-secondary hover:text-text-primary border border-border-default px-4 py-2 rounded-md transition-colors',
  danger:
    'bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 px-4 py-2 rounded-md transition-colors',
  icon: 'p-2 rounded-md hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}) => (
  <button
    className={cn(
      'inline-flex items-center justify-center gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[variant],
      className
    )}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading && <Spinner size="sm" />}
    {children}
  </button>
);
