import React from 'react';
import { Task, TaskStatus, Priority } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const isCompleted = task.status === TaskStatus.COMPLETED;

  // Función para formatear la fecha de forma amigable
  const formatFriendlyDate = (dateStr: string) => {
    if (!dateStr) return "Sin fecha";

    // Si la fecha ya es un formato amigable del sistema (ej. "Hoy")
    if (dateStr.toLowerCase().includes('hoy') || dateStr.toLowerCase().includes('mañana')) {
      return dateStr;
    }

    try {
      const date = new Date(dateStr);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };

      const time = date.toLocaleTimeString('es-ES', options);

      if (isToday) return `Hoy, ${time}`;

      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const getPriorityStyles = () => {
    switch (task.priority) {
      case Priority.HIGH:
        return { border: 'border-primary', text: 'text-primary', bg: 'bg-primary/5', icon: 'bolt' };
      case Priority.MEDIUM:
        return { border: 'border-amber-500', text: 'text-amber-600', bg: 'bg-amber-500/5', icon: 'priority_high' };
      case Priority.LOW:
        return { border: 'border-blue-400', text: 'text-blue-500', bg: 'bg-blue-400/5', icon: 'low_priority' };
      default:
        return { border: 'border-slate-200', text: 'text-slate-400', bg: 'bg-transparent', icon: 'notes' };
    }
  };

  const styles = getPriorityStyles();

  return (
    <div className={`group relative bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border-l-[6px] ${styles.border} flex items-center justify-between transition-all hover:shadow-md active:scale-[0.98] ${isCompleted ? 'opacity-60 grayscale-[0.5]' : ''}`}>
      <div className="flex items-start gap-4 flex-1 min-w-0">
        {/* Checkbox circular estilizado */}
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-1 transition-all duration-300 transform ${isCompleted ? 'scale-110 text-green-500' : 'text-slate-300 dark:text-slate-600 hover:text-primary'}`}
        >
          <span className="material-symbols-outlined text-[28px] font-variation-fill">
            {isCompleted ? 'check_circle' : 'circle'}
          </span>
        </button>

        <div className="flex flex-col flex-1 min-w-0">
          <h3 className={`font-bold text-slate-800 dark:text-slate-100 text-base leading-tight truncate pr-4 ${isCompleted ? 'line-through decoration-slate-400' : ''}`}>
            {task.title}
          </h3>

          <div className="flex items-center gap-3 mt-1.5">
            {/* Fecha Amigable */}
            <span className={`text-[11px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-full ${isCompleted ? 'bg-slate-100 text-slate-400' : `${styles.bg} ${styles.text}`}`}>
              <span className="material-symbols-outlined text-[14px]">
                {isCompleted ? 'done_all' : 'schedule'}
              </span>
              {isCompleted ? `Finalizada` : formatFriendlyDate(task.dueDate)}
            </span>

            {/* Tag de Prioridad sutil (Solo en móvil para no saturar) */}
            {!isCompleted && (
              <span className="md:hidden text-[10px] uppercase tracking-wider font-black text-slate-300">
                {task.priority}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="flex items-center gap-1 ml-4">
        {!isCompleted && (
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;