export interface User {
  id: string;
  cognitoId: string;
  email: string;
  roles: string[];
  createdAt: string;
}

export interface System {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Shift {
  id: string;
  systemId: string;
  system?: System;
  startedAt: string;
  endedAt: string;
  createdAt: string;
  updatedAt: string;
}

export enum TaskEntityType {
  EVENT = 'event',
  EVENT_VIDEO = 'event_video',
  EVENT_IMAGE = 'event_image',
}

export enum TaskStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface Task {
  id: string;
  shiftId: string;
  systemId: string;
  shift?: Shift;
  system?: System;
  entityType: TaskEntityType;
  entityId: string;
  status: TaskStatus;
  priority: number;
  workerId?: string;
  worker?: User;
  subType?: string;
  workerComment?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
  media?: TaskMedia;
}

export interface TaskMedia {
  thumbnailUrl: string;
  imageUrl?: string;
  videoUrl?: string;
  downloadUrl: string;
  fileName: string;
  capturedAt?: string;
  sizeLabel?: string;
}

export interface Event {
  id: string;
  shiftId: string;
  startedAt: string;
  endedAt?: string;
  createdAt: string;
  updatedAt: string;
}
