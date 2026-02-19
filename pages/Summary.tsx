import React from 'react';
import { Task, TaskStatus, Priority } from '../types';

interface SummaryProps {
  tasks: Task[];
}

const Summary: React.FC<SummaryProps> = ({ tasks }) => {
  const completed = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const highPriority = tasks.filter(t => t.priority === Priority.HIGH && t.status === TaskStatus.PENDING).length;
  const total = tasks.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-background-dark">
      <header className="flex-none bg-white dark:bg-surface-dark p-6 md:p-10 border-b border-slate-200 dark:border-white/5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Resumen</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Análisis de tu productividad semanal.</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 md:p-10 hide-scrollbar">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card: Progreso Circular */}
          <div className="md:col-span-2 bg-white dark:bg-surface-dark p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path className="text-slate-100 dark:text-white/5" strokeWidth="3" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-primary" strokeWidth="3" strokeDasharray={`${progress}, 100`} strokeLinecap="round" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black dark:text-white">{progress}%</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Completado</span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-black dark:text-white mb-2">¡Vas por buen camino!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">Has completado {completed} de {total} tareas esta semana. Mantén el ritmo para alcanzar tus objetivos.</p>
            </div>
          </div>

          {/* Card: Prioridad Alta */}
          <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20 flex flex-col justify-between">
            <span className="material-symbols-outlined text-[40px] opacity-50">bolt</span>
            <div>
              <span className="block text-4xl font-black">{highPriority}</span>
              <span className="text-sm font-bold opacity-80 uppercase tracking-wider">Urgentes hoy</span>
            </div>
          </div>

          {/* Stats Rápidas */}
          <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <div>
              <p className="text-2xl font-black dark:text-white">{completed}</p>
              <p className="text-xs text-slate-400 font-bold uppercase">Finalizadas</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
            <div>
              <p className="text-2xl font-black dark:text-white">{total - completed}</p>
              <p className="text-xs text-slate-400 font-bold uppercase">En espera</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Summary;