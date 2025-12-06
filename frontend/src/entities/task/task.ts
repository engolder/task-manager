export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTaskInput {
  text: string;
} 