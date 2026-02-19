import React from 'react';
import { Task, TaskStatus } from '../types';

interface CalendarProps {
  tasks: Task[];
}

const CalendarView: React.FC<CalendarProps> = ({ tasks }) => {
  // Simulación de días para la vista de agenda
  const days = ['Hoy', 'Mañana', '20 Feb', '21 Feb'];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-background-dark">
      <header className="flex-none bg-white dark:bg-surface-dark p-6 md:p-10 border-b border-slate-200 dark:border-white/5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Calendario</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Organiza tus entregas y proyectos.</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 md:p-10 hide-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8">
          {days.map((day) => (
            <section key={day} className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-black text-primary uppercase tracking-widest">{day}</h2>
                <div className="h-px bg-slate-200 dark:bg-white/5 flex-1"></div>
              </div>
              
              <div className="grid gap-3">
                {tasks.filter(t => t.dueDate.includes(day) || (day === 'Hoy' && t.dueDate.includes(':'))).length > 0 ? (
                  tasks.filter(t => t.dueDate.includes(day) || (day === 'Hoy' && t.dueDate.includes(':'))).map(task => (
                    <div key={task.id} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-10 rounded-full ${task.status === TaskStatus.COMPLETED ? 'bg-green-500' : 'bg-primary'}`}></div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white text-sm">{task.title}</p>
                          <p className="text-xs text-slate-400">{task.dueDate}</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-slate-300">event_available</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">No hay tareas programadas.</p>
                )}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CalendarView;