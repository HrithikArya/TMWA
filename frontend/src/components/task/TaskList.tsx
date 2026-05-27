import React from 'react';
import { TaskCard } from './TaskCard';
import { TaskCardSkeleton } from '@/components/ui/Skeleton';
import type { Task } from '@/types/task.types';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  isAdmin?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  onEdit,
  onDelete,
  onToggle,
  isAdmin = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg className="w-12 h-12 text-text-disabled mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-text-muted text-sm font-medium">No tasks found</p>
        <p className="text-text-disabled text-xs mt-1">Create a new task to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {tasks.map(task => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};
