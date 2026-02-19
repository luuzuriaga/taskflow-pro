import React, { useState } from 'react';
import { Task, TaskStatus, UserProfile } from '../types';
import TaskCard from '../components/TaskCard';

interface TaskListProps {
  tasks: Task[];
  user: UserProfile;
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (title: string) => void;
  onGoToProfile: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, user, onToggleTask, onEditTask, onDeleteTask, onAddTask, onGoToProfile }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const pendingCount = tasks.filter(t => t.status === TaskStatus.PENDING).length;
  const completedCount = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const processCount = Math.floor(pendingCount * 0.4); // Valor simulado para el diseño

  const filteredTasks = tasks
    .filter(t => {
      if (filter === 'pending') return t.status === TaskStatus.PENDING;
      if (filter === 'completed') return t.status === TaskStatus.COMPLETED;
      return true;
    })
    .sort((a, b) => {
      // Pendientes primero, completadas al final
      if (a.status === b.status) return 0;
      return a.status === TaskStatus.COMPLETED ? 1 : -1;
    });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle);
      setNewTaskTitle('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-background-dark">
      {/* Header Dinámico: Gradiente en móvil, Clean en PC */}
      <header className="flex-none bg-gradient-to-br from-primary to-background-dark md:from-white md:to-white dark:md:from-surface-dark dark:md:to-surface-dark pt-5 md:pt-10 pb-10 md:pb-10 px-6 md:px-10 shadow-lg md:shadow-none relative overflow-hidden transition-all">
        {/* Círculo decorativo solo visible en móvil */}
        <div className="md:hidden absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto">
          <div className="relative z-10 flex justify-between items-center mb-6">
            <div>
              <p className="text-white/80 md:text-slate-500 dark:md:text-slate-400 text-sm font-medium mb-1">Bienvenido de nuevo</p>
              <h1 className="text-3xl md:text-4xl font-black text-white md:text-slate-900 dark:md:text-white tracking-tight">Mis Tareas</h1>
            </div>
            <button
              onClick={onGoToProfile}
              className="h-12 w-12 rounded-full border-2 border-white/40 md:border-primary/20 overflow-hidden bg-surface-dark shadow-md active:scale-90 transition-transform"
              aria-label="Ir a perfil"
            >
              <img src={user.avatarUrl} alt="Perfil" className="w-full h-full object-cover" />
            </button>
          </div>

          {/* Stats Cards: Visibles en móvil como el diseño, ocultas o integradas en PC */}
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 md:hidden">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 min-w-[110px] border border-white/10">
              <span className="block text-2xl font-bold text-white">{pendingCount}</span>
              <span className="text-xs text-white/70 font-medium whitespace-nowrap">Pendientes</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 flex-1 min-w-[110px] border border-white/5">
              <span className="block text-2xl font-bold text-white/60">{processCount}</span>
              <span className="text-xs text-white/50 font-medium whitespace-nowrap">En proceso</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 flex-1 min-w-[110px] border border-white/5">
              <span className="block text-2xl font-bold text-white/60">{completedCount}</span>
              <span className="text-xs text-white/50 font-medium whitespace-nowrap">Completadas</span>
            </div>
          </div>
        </div>
      </header>

      {/* Cuerpo Principal */}
      <main className="flex-1 flex flex-col relative bg-slate-50 dark:bg-background-dark -mt-6 md:mt-0 rounded-t-[2.5rem] md:rounded-none overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.1)] md:shadow-none">
        {/* FAB escritorio - esquina inferior derecha */}
        <button
          onClick={() => onAddTask('')}
          title="Nueva tarea"
          className="hidden md:flex items-center justify-center absolute bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-primary shadow-[0_8px_30px_rgba(236,55,19,0.45)] text-white hover:bg-primary-dark hover:scale-110 active:scale-95 transition-all duration-200 border-4 border-white dark:border-background-dark"
        >
          <span className="material-symbols-outlined text-[36px]">add</span>
        </button>

        <div className="flex-1 overflow-y-auto px-6 md:px-10 pt-8 pb-32 hide-scrollbar">
          <div className="max-w-6xl mx-auto w-full">

            {/* Input de creación estilo imagen */}
            <form onSubmit={handleAddSubmit} className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm p-2 flex items-center gap-2 mb-8 border border-slate-200 dark:border-white/5">
              <div className="h-10 w-10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]">add_task</span>
              </div>
              <input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-base py-3 dark:text-white placeholder:text-slate-400"
                placeholder="¿Qué hay que hacer hoy?"
                type="text"
              />
              <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-transform active:scale-95">
                Crear
              </button>
            </form>

            {/* Selector de Filtros */}
            <div className="flex p-1 bg-slate-200/50 dark:bg-black/20 rounded-xl mb-8 max-w-md">
              {(['all', 'pending', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${filter === f
                    ? 'bg-white dark:bg-surface-dark text-primary shadow-md'
                    : 'text-slate-500'
                    }`}
                >
                  {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Completadas'}
                </button>
              ))}
            </div>

            {/* Lista de Tareas — Pendientes primero */}
            {filter === 'all' ? (
              <>
                {/* Pendientes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredTasks.filter(t => t.status === TaskStatus.PENDING).map((task) => (
                    <TaskCard key={task.id} task={task} onToggle={onToggleTask} onEdit={onEditTask} onDelete={onDeleteTask} />
                  ))}
                </div>

                {/* Separador + Completadas */}
                {filteredTasks.some(t => t.status === TaskStatus.COMPLETED) && (
                  <>
                    <div className="flex items-center gap-4 py-8">
                      <div className="h-px bg-slate-200 dark:bg-white/10 flex-1" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Completadas</span>
                      <div className="h-px bg-slate-200 dark:bg-white/10 flex-1" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredTasks.filter(t => t.status === TaskStatus.COMPLETED).map((task) => (
                        <TaskCard key={task.id} task={task} onToggle={onToggleTask} onEdit={onEditTask} onDelete={onDeleteTask} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              /* Vista filtrada (solo pendientes o solo completadas) */
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onToggle={onToggleTask} onEdit={onEditTask} onDelete={onDeleteTask} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TaskList;