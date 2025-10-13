import { type FC } from 'react'
import * as Checkbox from '@radix-ui/react-checkbox'
import type { Task } from "../../entities/task/task";
import * as styles from './styles.css'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export const TaskItem: FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div className={styles.item} data-testid="task-item">
      <Checkbox.Root
        className={styles.checkbox}
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
      >
        <Checkbox.Indicator>
          {task.completed && '✓'}
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span className={task.completed ? styles.completedText : styles.text}>
        {task.text}
      </span>
      <button
        className={styles.deleteButton}
        onClick={() => onDelete(task.id)}
        type="button"
      >
        삭제
      </button>
    </div>
  )
} 