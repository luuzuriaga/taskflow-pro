
export enum Priority {
  LOW = 'baja',
  MEDIUM = 'media',
  HIGH = 'alta'
}

export enum TaskStatus {
  PENDING = 'pendiente',
  COMPLETED = 'completada'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  lastName: string;
  avatarUrl: string;
}

export type View = 'tasks' | 'calendar' | 'summary' | 'profile' | 'edit-task';
