import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';

export const formatDate = (date: string | Date | null): string => {
  if (!date) return '';
  return format(new Date(date), 'MMM d, yyyy');
};

export const formatRelative = (date: string | Date): string =>
  formatDistanceToNow(new Date(date), { addSuffix: true });

export const isOverdue = (dueDate: string | null, status: string): boolean => {
  if (!dueDate || status === 'completed') return false;
  return isPast(new Date(dueDate)) && !isToday(new Date(dueDate));
};

export const getDueDateLabel = (dueDate: string | null): string => {
  if (!dueDate) return '';
  const d = new Date(dueDate);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return formatDate(d);
};
