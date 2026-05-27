import React from 'react';
import { cn } from '@/utils/cn';
import type { TaskPriority } from '@/types/task.types';

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-danger/10 text-danger border-danger/20' },
  medium: { label: 'Medium', className: 'bg-warning/10 text-warning border-warning/20' },
  low: { label: 'Low', className: 'bg-success/10 text-success border-success/20' },
};

interface BadgeProps {
  priority: TaskPriority;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ priority, className }) => {
  const { label, className: colorClass } = priorityConfig[priority];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
        colorClass,
        className
      )}
    >
      {label}
    </span>
  );
};
