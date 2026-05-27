import { type ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { TaskForm } from '@/components/task/TaskForm';
import type { Task } from '@/types/task.types';

const Wrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

const noop = () => undefined;

describe('TaskForm — create mode', () => {
  it('renders title input and priority select', () => {
    render(<TaskForm onSuccess={noop} onClose={noop} />, { wrapper: Wrapper });
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  it('shows validation error when title is empty', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSuccess={noop} onClose={noop} />, { wrapper: Wrapper });

    await user.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(screen.getByText(/title required/i)).toBeInTheDocument();
    });
  });

  it('calls onClose when cancel is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<TaskForm onSuccess={noop} onClose={onClose} />, { wrapper: Wrapper });

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });
});

describe('TaskForm — edit mode', () => {
  const editTask: Task = {
    _id: 'task-1',
    title: 'Existing task',
    description: 'Existing desc',
    status: 'pending',
    priority: 'low',
    dueDate: null,
    owner: { _id: 'u1', name: 'Test' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('populates fields with existing task data', () => {
    render(<TaskForm task={editTask} onSuccess={noop} onClose={noop} />, { wrapper: Wrapper });
    expect(screen.getByDisplayValue('Existing task')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });
});
