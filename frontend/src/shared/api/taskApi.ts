import ky from 'ky';
import type { Task, CreateTaskInput } from '../../entities/task/task';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = ky.create({
  prefixUrl: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiResponse<T> {
  data: T;
}

export interface UpdateTaskInput {
  text?: string;
  completed?: boolean;
}

export const taskApi = {
  async getAll(completed?: boolean): Promise<Task[]> {
    const searchParams = new URLSearchParams();
    if (completed !== undefined) {
      searchParams.set('completed', completed.toString());
    }
    const response = await api.get('tasks', { searchParams }).json<ApiResponse<Task[]>>();
    return response.data;
  },

  async getById(id: string): Promise<Task> {
    const response = await api.get(`tasks/${id}`).json<ApiResponse<Task>>();
    return response.data;
  },

  async create(input: CreateTaskInput): Promise<Task> {
    const response = await api.post('tasks', { json: input }).json<ApiResponse<Task>>();
    return response.data;
  },

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const response = await api.put(`tasks/${id}`, { json: input }).json<ApiResponse<Task>>();
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`tasks/${id}`);
  },

  async toggle(id: string, completed: boolean): Promise<Task> {
    return this.update(id, { completed });
  },
};