import { type FC } from 'react'
import type { Task } from "../../entities/task/task";
import * as styles from './styles.css'

interface TaskItemProps {
  task: Task
  onComplete: (id: string) => void
  onDelete: (id: string) => void
}

export const TaskItem: FC<TaskItemProps> = ({ task, onComplete, onDelete }) => {
  return (
    <div className={styles.item} data-testid="task-item">
      <span className={styles.text}>
        {task.text}
      </span>
      <button
        className={styles.completeButton}
        onClick={() => onComplete(task.id)}
        type="button"
        aria-label="완료"
      >
        ✓
      </button>
      <button
        className={styles.deleteButton}
        onClick={() => onDelete(task.id)}
        type="button"
        aria-label="삭제"
      >
        ✕
      </button>
    </div>
  )
} 