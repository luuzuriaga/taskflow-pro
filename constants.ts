
import { Task, TaskStatus, Priority, UserProfile } from './types';

export const INITIAL_USER: UserProfile = {
  name: 'Juan',
  lastName: 'Pérez',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxDynG4aya61yPZaOwEo5hWmHJSpgISSrU0R0C-hYioyxy70Xz8nyafXTrhGNj_E-lrODtrrisHUpgnJQe66FIeBWCii5J5fNs3cIJU1TfhTLfQezMmhaPKEBt7Go8TIa149Bqn3mIywfLHEh-wLrwqtvHifzmTw_531UD_5E50AcyYkBanGk5BqRao7JUJ1mRHC2vyQslKgbEWz3nor1ET9_Oc_IT1VD5HFE1Dfnmu2TAlv-_6oj3sUu_bW70DkLhkWqQ9V55fA'
};

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Comprar ingredientes para la cena',
    description: 'Necesito verduras frescas y pollo.',
    status: TaskStatus.PENDING,
    priority: Priority.HIGH,
    dueDate: 'Hoy, 18:00',
    createdAt: '12/10/2023'
  },
  {
    id: '2',
    title: 'Revisar propuesta de diseño',
    description: 'Validar los colores y tipografía con el equipo.',
    status: TaskStatus.PENDING,
    priority: Priority.LOW,
    dueDate: 'Mañana',
    createdAt: '13/10/2023'
  },
  {
    id: '3',
    title: 'Llamar al médico',
    description: 'Cita anual de revisión.',
    status: TaskStatus.PENDING,
    priority: Priority.MEDIUM,
    dueDate: '15 Oct, 10:00',
    createdAt: '14/10/2023'
  },
  {
    id: '4',
    title: 'Pagar factura de internet',
    description: 'Vence este fin de semana.',
    status: TaskStatus.COMPLETED,
    priority: Priority.HIGH,
    dueDate: 'Ayer',
    createdAt: '10/10/2023'
  },
  {
    id: '5',
    title: 'Enviar correo al equipo',
    description: 'Resumen semanal de avances.',
    status: TaskStatus.COMPLETED,
    priority: Priority.LOW,
    dueDate: 'Hace 2 días',
    createdAt: '08/10/2023'
  }
];
