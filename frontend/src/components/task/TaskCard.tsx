import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';
import type { Task } from '@/types/task.types';
import { formatDate, isOverdue } from '@/utils/formatDate';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  isAdmin?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggle,
  isAdmin = false,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="bg-bg-surface border border-border-default rounded-lg p-4 hover:border-border-strong transition-all duration-200 hover:scale-[1.01] group relative">
      <div className="flex items-start justify-between gap-2 mb-2">
        <Badge priority={task.priority} />
        <div className="relative">
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="p-1 rounded hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Task menu"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-6 z-20 bg-bg-elevated border border-border-default rounded-lg shadow-xl w-32 py-1 animate-fade-in">
                <button
                  onClick={() => { onEdit(task); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-overlay transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => { onDelete(task._id); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-sm text-danger hover:bg-danger/10 transition-colors"
                >
                  {isAdmin ? 'Delete (admin)' : 'Delete'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <h3 className="font-semibold text-text-primary text-sm leading-snug line-clamp-2 mb-1">
        {task.title}
      </h3>

      {task.description && (
        <p className="text-xs text-text-muted line-clamp-2 mb-3">{task.description}</p>
      )}

      {isAdmin && (
        <p className="text-xs text-text-disabled mb-2">by {task.owner.name}</p>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
        {task.dueDate ? (
          <span className={cn('text-xs flex items-center gap-1', overdue ? 'text-danger font-medium' : 'text-text-muted')}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
          </span>
        ) : (
          <span />
        )}

        <button
          onClick={() => onToggle(task._id)}
          className={cn(
            'text-xs px-2 py-0.5 rounded-full border cursor-pointer transition-colors font-medium',
            task.status === 'completed'
              ? 'bg-success/10 text-success border-success/20 hover:bg-success/20'
              : 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20'
          )}
        >
          {task.status === 'completed' ? 'Completed' : 'Pending'}
        </button>
      </div>
    </div>
  );
};
