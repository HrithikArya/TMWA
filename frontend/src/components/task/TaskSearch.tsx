import React from 'react';
import { Input } from '@/components/ui/Input';

interface TaskSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const TaskSearch: React.FC<TaskSearchProps> = ({ value, onChange }) => (
  <Input
    placeholder="Search tasks..."
    value={value}
    onChange={e => onChange(e.target.value)}
    leftIcon={SearchIcon}
  />
);
