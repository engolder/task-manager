import type { FC } from "react";
import type { Task } from "../../entities/task/task";
import { formatRelativeTime } from "../../shared/lib/dateFormat";
import * as styles from "./completedTaskItem.css";

interface CompletedTaskItemProps {
  task: Task;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CompletedTaskItem: FC<CompletedTaskItemProps> = ({
  task,
  onRestore,
  onDelete,
}) => {
  return (
    <div className={styles.item} data-testid="completed-task-item">
      <div className={styles.content}>
        <span className={styles.text}>{task.text}</span>
        <span className={styles.time}>
          {formatRelativeTime(task.updatedAt || task.createdAt)}
        </span>
      </div>
      <button
        type="button"
        className={styles.restoreButton}
        onClick={() => onRestore(task.id)}
        aria-label="복원"
        title="미완료로 되돌리기"
      >
        ↩
      </button>
      <button
        type="button"
        className={styles.deleteButton}
        onClick={() => onDelete(task.id)}
        aria-label="삭제"
      >
        ✕
      </button>
    </div>
  );
};
