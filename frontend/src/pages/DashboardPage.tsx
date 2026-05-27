import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { fetchTasks, deleteTask, toggleTask } from '@/features/tasks/tasksSlice';
import { TaskList } from '@/components/task/TaskList';
import { TaskStats } from '@/components/task/TaskStats';
import { TaskFilters } from '@/components/task/TaskFilters';
import { TaskSearch } from '@/components/task/TaskSearch';
import { TaskForm } from '@/components/task/TaskForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useDebounce } from '@/hooks/useDebounce';
import type { Task } from '@/types/task.types';

export const DashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '');
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 300);
  const page = Number(searchParams.get('page') ?? 1);
  const status = searchParams.get('status') ?? 'all';

  const dispatch = useAppDispatch();
  const { items: tasks, pagination, isLoading } = useAppSelector(state => state.tasks);

  const loadTasks = useCallback(() => {
    void dispatch(fetchTasks({ page, limit: 10, status, q: debouncedSearch || undefined }));
  }, [dispatch, page, status, debouncedSearch]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const setFilter = (value: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('status', value);
      next.set('page', '1');
      return next;
    });
  };

  const setPage = (p: number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('page', String(p));
      return next;
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      toast.success('Task deleted');
      loadTasks();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await dispatch(toggleTask(id)).unwrap();
      loadTasks();
    } catch {
      toast.error('Failed to update task');
    }
  };

  return (
    <div className="flex-1 p-4 lg:p-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-text-primary">My Tasks</h1>
        <Button onClick={() => setShowCreateModal(true)}>+ New Task</Button>
      </div>

      <TaskStats tasks={tasks} total={pagination?.total ?? 0} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <TaskSearch value={searchInput} onChange={v => { setSearchInput(v); setPage(1); }} />
        </div>
        <TaskFilters
          activeFilter={(status as 'all' | 'pending' | 'completed') ?? 'all'}
          onChange={setFilter}
        />
      </div>

      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        onEdit={setEditTask}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="ghost"
            onClick={() => setPage(page - 1)}
            disabled={!pagination.hasPrev}
            className="px-3 py-1.5 text-xs"
          >
            Prev
          </Button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter(p => Math.abs(p - page) <= 2)
            .map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 text-xs rounded-md transition-colors ${
                  p === page
                    ? 'bg-accent text-white'
                    : 'text-text-muted hover:bg-bg-elevated hover:text-text-primary'
                }`}
              >
                {p}
              </button>
            ))}
          <Button
            variant="ghost"
            onClick={() => setPage(page + 1)}
            disabled={!pagination.hasNext}
            className="px-3 py-1.5 text-xs"
          >
            Next
          </Button>
        </div>
      )}

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="New Task">
        <TaskForm
          onSuccess={() => { setShowCreateModal(false); loadTasks(); }}
          onClose={() => setShowCreateModal(false)}
        />
      </Modal>

      <Modal isOpen={!!editTask} onClose={() => setEditTask(null)} title="Edit Task">
        {editTask && (
          <TaskForm
            task={editTask}
            onSuccess={() => { setEditTask(null); loadTasks(); }}
            onClose={() => setEditTask(null)}
          />
        )}
      </Modal>
    </div>
  );
};
