import type { System, Shift, Task, User } from '@/types';
import { TaskStatus, TaskEntityType } from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockSystems: System[] = [
  {
    id: '1',
    name: 'Football Stream 1',
    description: 'Main football streaming system',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Basketball Stream A',
    description: 'Basketball streaming system',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockShifts: Shift[] = [
  {
    id: 'shift-1',
    systemId: '1',
    system: mockSystems[0],
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockTasks: Task[] = [
  {
    id: 'task-1',
    shiftId: 'shift-1',
    systemId: '1',
    shift: mockShifts[0],
    system: mockSystems[0],
    entityType: TaskEntityType.EVENT_VIDEO,
    entityId: 'video-1',
    status: TaskStatus.PENDING,
    priority: 5,
    media: {
      thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c643e7485?auto=format&fit=crop&w=240&q=80',
      videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      downloadUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      fileName: 'event-video-1.mp4',
      capturedAt: new Date().toISOString(),
      sizeLabel: '12.4 MB',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    shiftId: 'shift-1',
    systemId: '1',
    entityType: TaskEntityType.EVENT_IMAGE,
    entityId: 'image-1',
    status: TaskStatus.IN_PROGRESS,
    priority: 3,
    media: {
      thumbnailUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=240&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
      downloadUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
      fileName: 'event-image-1.jpg',
      capturedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      sizeLabel: '2.1 MB',
    },
    workerId: 'user-1',
    startedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockUser: User = {
  id: 'user-1',
  cognitoId: 'cognito-user-1',
  email: 'worker@example.com',
  roles: ['worker'],
  createdAt: new Date().toISOString(),
};

export async function getMockData<T>(url: string): Promise<T> {
  await delay(300 + Math.random() * 200);

  if (url === '/systems') {
    return mockSystems as T;
  }

  if (url === '/shifts') {
    return mockShifts as T;
  }

  if (url.startsWith('/shifts/')) {
    const id = url.split('/')[2];
    const shift = mockShifts.find((s) => s.id === id);
    if (!shift) throw new Error('Shift not found');
    return shift as T;
  }

  if (url === '/tasks/my') {
    return mockTasks.filter((t) =>
      [TaskStatus.PENDING, TaskStatus.ASSIGNED, TaskStatus.IN_PROGRESS].includes(t.status),
    ) as T;
  }

  if (url.startsWith('/tasks/shift/')) {
    return mockTasks as T;
  }

  if (url.startsWith('/tasks/next')) {
    const pending = mockTasks.find((t) => t.status === TaskStatus.PENDING);
    return pending as T;
  }

  if (url === '/me') {
    return mockUser as T;
  }

  throw new Error(`Mock data not found for URL: ${url}`);
}

export async function postMockData<T>(url: string, data?: unknown): Promise<T> {
  await delay(300 + Math.random() * 200);

  if (url === '/systems') {
    const newSystem: System = {
      id: String(mockSystems.length + 1),
      ...(data as Partial<System>),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as System;
    mockSystems.push(newSystem);
    return newSystem as T;
  }

  if (url === '/tasks') {
    const newTask: Task = {
      id: `task-${mockTasks.length + 1}`,
      ...(data as Partial<Task>),
      status: TaskStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Task;
    mockTasks.push(newTask);
    return newTask as T;
  }

  throw new Error(`Mock POST not implemented for URL: ${url}`);
}

export async function putMockData<T>(url: string, data?: unknown): Promise<T> {
  await delay(300 + Math.random() * 200);

  if (url.includes('/tasks/') && url.includes('/start')) {
    const taskId = url.split('/')[2];
    const task = mockTasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.status = TaskStatus.IN_PROGRESS;
    task.startedAt = new Date().toISOString();
    return task as T;
  }

  if (url.includes('/tasks/') && url.includes('/complete')) {
    const taskId = url.split('/')[2];
    const task = mockTasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.status = TaskStatus.COMPLETED;
    task.completedAt = new Date().toISOString();
    task.workerComment = (data as { comment?: string })?.comment;
    return task as T;
  }

  if (url.includes('/tasks/') && url.includes('/fail')) {
    const taskId = url.split('/')[2];
    const task = mockTasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.status = TaskStatus.FAILED;
    task.completedAt = new Date().toISOString();
    task.workerComment = (data as { comment?: string })?.comment;
    return task as T;
  }

  if (url.includes('/tasks/') && url.includes('/approve')) {
    const taskId = url.split('/')[2];
    const task = mockTasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.status = TaskStatus.COMPLETED;
    task.completedAt = new Date().toISOString();
    task.workerComment = (data as { comment?: string })?.comment;
    return task as T;
  }

  if (url.includes('/tasks/') && url.includes('/disapprove')) {
    const taskId = url.split('/')[2];
    const task = mockTasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.status = TaskStatus.FAILED;
    task.completedAt = new Date().toISOString();
    task.workerComment = (data as { comment?: string })?.comment;
    return task as T;
  }

  throw new Error(`Mock PUT not implemented for URL: ${url}`);
}

export async function patchMockData<T>(url: string, data?: unknown): Promise<T> {
  await delay(300 + Math.random() * 200);

  if (url.startsWith('/systems/')) {
    const id = url.split('/')[2];
    const system = mockSystems.find((s) => s.id === id);
    if (!system) throw new Error('System not found');
    Object.assign(system, data);
    system.updatedAt = new Date().toISOString();
    return system as T;
  }

  throw new Error(`Mock PATCH not implemented for URL: ${url}`);
}

export async function deleteMockData<T>(url: string): Promise<T> {
  await delay(300 + Math.random() * 200);

  if (url.startsWith('/systems/')) {
    const id = url.split('/')[2];
    const index = mockSystems.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('System not found');
    mockSystems.splice(index, 1);
    return { message: 'System deleted' } as T;
  }

  throw new Error(`Mock DELETE not implemented for URL: ${url}`);
}
