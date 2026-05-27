import React from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn('bg-bg-elevated rounded animate-skeleton', className)} />
);

export const TaskCardSkeleton: React.FC = () => (
  <div className="bg-bg-surface border border-border-default rounded-lg p-4 space-y-3">
    <div className="flex justify-between items-start">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-5 w-5 rounded-full" />
    </div>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-2/3" />
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
  </div>
);
