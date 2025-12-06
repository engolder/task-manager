import { useState, type FC, type FormEvent } from "react";
import type { Task } from "../../entities/task/task";
import {
	useCreateTask,
	useDeleteTask,
	useTasks,
	useToggleTask,
} from "../../features/task-list/hooks/useTasks";
import * as styles from "./styles.css";
import { TaskItem } from "./TaskItem";

export const TaskList: FC = () => {
  const [newTask, setNewTask] = useState("");

  const { data: tasks = [], isLoading, error } = useTasks(false);
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

  const handleComplete = async (id: string) => {
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
			<div className={styles.list} data-testid="task-list">
				{tasks.map((task: Task) => (
					<TaskItem
						key={task.id}
						task={task}
						onComplete={handleComplete}
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
					{createTaskMutation.isPending ? "추가중..." : "추가"}
				</button>
			</form>
		</div>
	);
}
