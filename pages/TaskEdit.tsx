import React, { useState } from 'react';
import { Task, Priority, TaskStatus } from '../types';

interface TaskEditProps {
  task: Task;
  onSave: (updatedTask: Task) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

const TaskEdit: React.FC<TaskEditProps> = ({ task, onSave, onCancel, onDelete }) => {
  const [editedTask, setEditedTask] = useState<Task>({ ...task });

  const handleSave = () => {
    onSave(editedTask);
  };

  return (
    <div className="flex h-full w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Header adaptable */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-white/5 md:px-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="flex items-center justify-center w-10 h-10 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="text-xl font-black tracking-tight dark:text-white">Editar Tarea</h1>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
          <span className="hidden md:inline">Eliminar</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 md:p-10 hide-scrollbar">
        <div className="max-w-4xl mx-auto">
          {/* Layout de dos columnas en PC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Columna Izquierda: Contenido Principal */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Título</label>
                <input
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="w-full rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark p-4 text-base focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white shadow-sm"
                  placeholder="Ej. Comprar ingredientes..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Descripción</label>
                <textarea
                  value={editedTask.description}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  className="w-full rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark p-4 text-base focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[200px] resize-none dark:text-white shadow-sm leading-relaxed"
                  placeholder="Añade detalles sobre esta tarea..."
                />
              </div>
            </div>

            {/* Columna Derecha: Metadatos y Fecha */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm space-y-6">

                {/* Nueva sección: Fecha y Hora de Vencimiento */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">event</span>
                    Vencimiento
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="datetime-local"
                      className="w-full rounded-xl border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/20 p-3 text-sm dark:text-white focus:ring-primary"
                      onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                    // Nota: Puedes manejar el formato de fecha con una librería como date-fns si es necesario
                    />
                    <p className="text-[10px] text-slate-400">Actual: {editedTask.dueDate}</p>
                  </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-white/5"></div>

                {/* Prioridad */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Nivel de Prioridad</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(Priority).map((p) => (
                      <button
                        key={p}
                        onClick={() => setEditedTask({ ...editedTask, priority: p })}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${editedTask.priority === p
                            ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                            : 'bg-slate-50 dark:bg-black/20 border-transparent text-slate-500'
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-white/5"></div>

                {/* Información de Registro */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Creado el:</span>
                    <span className="font-bold dark:text-slate-300">{editedTask.createdAt}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Estado:</span>
                    <span className={`font-bold ${editedTask.status === TaskStatus.COMPLETED ? 'text-green-500' : 'text-orange-500'}`}>
                      {editedTask.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de acción solo visibles en PC aquí (opcional) */}
              <div className="hidden md:flex flex-col gap-3">
                <button
                  onClick={handleSave}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer fijo para Móvil */}
      <footer className="md:hidden p-6 bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-white/5 pb-10">
        <button
          onClick={handleSave}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">save</span>
          Guardar Cambios
        </button>
      </footer>
    </div>
  );
};

export default TaskEdit;