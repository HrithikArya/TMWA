import { Toaster } from 'react-hot-toast';

export const ToastProvider: React.FC = () => (
  <Toaster
    position="bottom-right"
    toastOptions={{
      duration: 3000,
      style: {
        background: 'var(--bg-elevated)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-default)',
        borderRadius: '8px',
        fontSize: '14px',
      },
      success: {
        iconTheme: {
          primary: 'var(--success)',
          secondary: 'var(--bg-elevated)',
        },
      },
      error: {
        iconTheme: {
          primary: 'var(--danger)',
          secondary: 'var(--bg-elevated)',
        },
      },
    }}
  />
);

import React from 'react';
export { toast } from 'react-hot-toast';
