import type { FC } from "react";
import type { Task } from "../entities/task/task";
import {
	useDeleteTask,
	useTasks,
	useToggleTask,
} from "../features/task-list/hooks/useTasks";
import { CompletedTaskItem } from "../widgets/task/CompletedTaskItem";
import * as styles from "../widgets/task/styles.css";

export const HistoryPage: FC = () => {
  const { data: tasks = [], isLoading, error } = useTasks(true); // completed=true
  const toggleTaskMutation = useToggleTask();
  const deleteTaskMutation = useDeleteTask();

  const handleRestore = async (id: string) => {
    try {
      await toggleTaskMutation.mutateAsync({ id, completed: false });
    } catch (error) {
      console.error('Failed to restore task:', error);
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
        <div>Error loading completed tasks: {error.message}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.list} data-testid="completed-task-list">
        {tasks.map((task: Task) => (
          <CompletedTaskItem
            key={task.id}
            task={task}
            onRestore={handleRestore}
            onDelete={handleDelete}
          />
        ))}
        {tasks.length === 0 && (
          <div className={styles.empty}>완료된 작업이 없습니다.</div>
        )}
      </div>
    </div>
  );
};
