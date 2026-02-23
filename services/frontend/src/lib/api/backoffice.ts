import { apiClient } from './client';
import type { System, Shift, Task, User, TaskStatus } from '@/types';

export const backofficeApi = {
  // Systems
  getSystems: () => apiClient.get<System[]>('/systems'),
  getSystem: (id: string) => apiClient.get<System>(`/systems/${id}`),
  createSystem: (data: { name: string; description?: string }) =>
    apiClient.post<System>('/systems', data),
  updateSystem: (id: string, data: Partial<System>) =>
    apiClient.patch<System>(`/systems/${id}`, data),
  deleteSystem: (id: string) => apiClient.delete<{ message: string }>(`/systems/${id}`),

  // Shifts
  getShifts: () => apiClient.get<Shift[]>('/shifts'),
  getShift: (id: string) => apiClient.get<Shift>(`/shifts/${id}`),

  // Tasks
  getMyTasks: (status?: TaskStatus) =>
    apiClient.get<Task[]>(`/tasks/my${status ? `?status=${status}` : ''}`),
  getTasksByShift: (shiftId: string) => apiClient.get<Task[]>(`/tasks/shift/${shiftId}`),
  getNextTask: (shiftId: string) => apiClient.get<Task | null>(`/tasks/next?shiftId=${shiftId}`),
  createTask: (data: {
    shiftId: string;
    systemId: string;
    entityType: string;
    entityId: string;
    priority?: number;
    subType?: string;
  }) => apiClient.post<Task>('/tasks', data),
  startTask: (taskId: string) => apiClient.put<Task>(`/tasks/${taskId}/start`),
  completeTask: (taskId: string, comment?: string) =>
    apiClient.put<Task>(`/tasks/${taskId}/complete`, { comment }),
  failTask: (taskId: string, comment?: string) =>
    apiClient.put<Task>(`/tasks/${taskId}/fail`, { comment }),
  approveTask: (taskId: string, comment?: string) =>
    apiClient.put<Task>(`/tasks/${taskId}/approve`, { comment }),
  disapproveTask: (taskId: string, comment?: string) =>
    apiClient.put<Task>(`/tasks/${taskId}/disapprove`, { comment }),

  // User
  getCurrentUser: () => apiClient.get<User>('/me'),
};
