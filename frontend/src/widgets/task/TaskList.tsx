import { type FC, useState, type FormEvent } from 'react'
import { TaskItem } from './TaskItem'
import { useTasks, useCreateTask, useToggleTask, useDeleteTask } from '../../features/task-list/hooks/useTasks';
import type { Task } from "../../entities/task/task";
import * as styles from './styles.css'

export const TaskList: FC = () => {
  const [newTask, setNewTask] = useState("");
  
  const { data: tasks = [], isLoading, error } = useTasks();
  const createTaskMutation = useCreateTask();
  const toggleTaskMutation = useToggleTask();
  const deleteTaskMutation = useDeleteTask();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await createTaskMutation.mutateAsync({ text: newTask.trim() });
      setNewTask("");
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleToggle = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      await toggleTaskMutation.mutateAsync({ id, completed: !task.completed });
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTaskMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div>Error loading tasks: {error.message}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>작업 목록</h1>
      </header>

      <div className={styles.list}>
        {tasks.map((task: Task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
        {tasks.length === 0 && (
          <div className={styles.empty}>작업이 없습니다.</div>
        )}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="작업을 입력하세요"
          disabled={createTaskMutation.isPending}
        />
        <button 
          type="submit" 
          className={styles.addButton}
          disabled={createTaskMutation.isPending}
        >
          {createTaskMutation.isPending ? '추가중...' : '추가'}
        </button>
      </form>
    </div>
  );
}
