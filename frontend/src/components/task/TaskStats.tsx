import React from 'react';
import type { Task } from '@/types/task.types';

interface TaskStatsProps {
  tasks: Task[];
  total: number;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks, total }) => {
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      {[
        { label: 'Total', value: total, color: 'text-info' },
        { label: 'Pending', value: pending, color: 'text-warning' },
        { label: 'Completed', value: completed, color: 'text-success' },
      ].map(({ label, value, color }) => (
        <div
          key={label}
          className="bg-bg-surface border border-border-default rounded-lg px-4 py-3 text-center"
        >
          <p className={`text-xl font-bold ${color}`}>{value}</p>
          <p className="text-xs text-text-muted mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
};
