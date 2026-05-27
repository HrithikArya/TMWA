import React from 'react';
import { cn } from '@/utils/cn';

type FilterValue = 'all' | 'pending' | 'completed';

interface TaskFiltersProps {
  activeFilter: FilterValue;
  onChange: (filter: FilterValue) => void;
}

const filters: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
];

export const TaskFilters: React.FC<TaskFiltersProps> = ({ activeFilter, onChange }) => (
  <div className="flex gap-1 bg-bg-elevated rounded-lg p-1">
    {filters.map(({ label, value }) => (
      <button
        key={value}
        onClick={() => onChange(value)}
        className={cn(
          'flex-1 px-3 py-1.5 text-sm rounded-md transition-colors font-medium',
          activeFilter === value
            ? 'bg-bg-surface text-text-primary shadow-sm'
            : 'text-text-muted hover:text-text-secondary'
        )}
      >
        {label}
      </button>
    ))}
  </div>
);
