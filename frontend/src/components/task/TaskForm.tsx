import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useAppDispatch } from '@/app/store';
import { createTask, updateTask } from '@/features/tasks/tasksSlice';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Task } from '@/types/task.types';

const today = new Date().toISOString().split('T')[0];

const schema = z.object({
  title: z.string().min(1, 'Title required').max(100, 'Max 100 chars'),
  description: z.string().max(500, 'Max 500 chars').optional(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface TaskFormProps {
  task?: Task;
  onSuccess: () => void;
  onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSuccess, onClose }) => {
  const isEdit = !!task;
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      priority: task?.priority ?? 'medium',
      dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      if (isEdit && task) {
        await dispatch(updateTask({ id: task._id, ...data })).unwrap();
        toast.success('Task updated');
      } else {
        await dispatch(createTask(data)).unwrap();
        toast.success('Task created');
      }
      onSuccess();
    } catch {
      toast.error(isEdit ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Title"
        placeholder="Task title..."
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-text-secondary">Description</label>
        <textarea
          className="w-full bg-bg-elevated border border-border-default rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
          rows={3}
          placeholder="Optional description..."
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs text-danger">{errors.description.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="priority" className="text-sm font-medium text-text-secondary">Priority</label>
        <select
          id="priority"
          className="w-full bg-bg-elevated border border-border-default rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
          {...register('priority')}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <Input
        label="Due Date"
        type="date"
        min={today}
        error={errors.dueDate?.message}
        {...register('dueDate')}
      />

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {isEdit ? 'Save changes' : 'Create task'}
        </Button>
      </div>
    </form>
  );
};
