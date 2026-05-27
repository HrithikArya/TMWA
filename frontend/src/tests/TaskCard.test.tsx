import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskCard } from '@/components/task/TaskCard';
import type { Task } from '@/types/task.types';

const mockTask: Task = {
  _id: 'task-1',
  title: 'Fix login bug',
  description: 'JWT not expiring correctly',
  status: 'pending',
  priority: 'high',
  dueDate: null,
  owner: { _id: 'user-1', name: 'Test User' },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const noop = () => undefined;

describe('TaskCard', () => {
  it('renders task title', () => {
    render(
      <TaskCard task={mockTask} onEdit={noop} onDelete={noop} onToggle={noop} />
    );
    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(
      <TaskCard task={mockTask} onEdit={noop} onDelete={noop} onToggle={noop} />
    );
    expect(screen.getByText('JWT not expiring correctly')).toBeInTheDocument();
  });

  it('renders High priority badge', () => {
    render(
      <TaskCard task={mockTask} onEdit={noop} onDelete={noop} onToggle={noop} />
    );
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('renders Pending status toggle', () => {
    render(
      <TaskCard task={mockTask} onEdit={noop} onDelete={noop} onToggle={noop} />
    );
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('calls onToggle when status chip is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <TaskCard task={mockTask} onEdit={noop} onDelete={noop} onToggle={onToggle} />
    );

    await user.click(screen.getByText('Pending'));
    expect(onToggle).toHaveBeenCalledWith('task-1');
  });

  it('shows owner name when isAdmin', () => {
    render(
      <TaskCard task={mockTask} onEdit={noop} onDelete={noop} onToggle={noop} isAdmin />
    );
    expect(screen.getByText(/by Test User/i)).toBeInTheDocument();
  });
});
