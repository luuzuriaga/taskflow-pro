import React from 'react';
import { View, UserProfile } from '../types';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface NavBarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onAddTask: () => void;
  user: UserProfile;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  onLogout: () => void;
  authUser: AuthUser;
}

const NavBar: React.FC<NavBarProps> = ({
  currentView, onViewChange, onAddTask, user,
  toggleDarkMode, isDarkMode, onLogout, authUser,
}) => {
  // Ocultar nav móvil en pantalla de edición de tarea (su footer tiene el botón guardar)
  const hideMobileNav = currentView === 'edit-task';

  const NavItem = ({ view, icon, label }: { view: View; icon: string; label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => onViewChange(view)}
        className={`flex md:flex-row flex-col items-center justify-center gap-1 md:gap-3 p-2 md:p-3 rounded-xl transition-all w-full
          ${isActive
            ? 'text-primary md:bg-primary md:text-white md:shadow-lg md:shadow-primary/20'
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 md:hover:bg-slate-100 dark:md:hover:bg-white/5'}`}
      >
        <span className={`material-symbols-outlined text-[26px] md:text-[24px] ${isActive && 'md:fill-0'}`}>
          {icon}
        </span>
        <span className={`text-[10px] md:text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <>
      {/* ── BARRA SUPERIOR MÓVIL/TABLET ─────────────────────────────── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-white dark:bg-surface-dark border-b border-slate-100 dark:border-white/5 px-4 flex items-center justify-between shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1 rounded-lg text-white">
            <span className="material-symbols-outlined text-[20px]">bolt</span>
          </div>
          <span className="text-base font-black tracking-tight dark:text-white">
            TaskFlow <span className="text-primary">PRO</span>
          </span>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1">
          {/* Toggle dark mode */}
          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Cambiar tema"
          >
            <span className="material-symbols-outlined text-[20px]">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
          {/* Cerrar sesión */}
          <button
            onClick={onLogout}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            aria-label="Cerrar sesión"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </header>

      {/* ── BARRA INFERIOR MÓVIL ────────────────────────────────────── */}
      {!hideMobileNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-white/5 px-6 pb-6 pt-3 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-end max-w-md mx-auto relative">
            <NavItem view="tasks" icon="format_list_bulleted" label="Tareas" />
            <NavItem view="calendar" icon="calendar_month" label="Calendario" />

            {/* Botón Central Flotante */}
            <div className="-mt-12 relative z-50">
              <button
                onClick={onAddTask}
                className="h-16 w-16 rounded-full bg-primary shadow-[0_8px_25px_rgba(236,55,19,0.4)] flex items-center justify-center text-white transform transition-transform active:scale-90 border-4 border-white dark:border-surface-dark"
              >
                <span className="material-symbols-outlined text-[36px]">add</span>
              </button>
            </div>

            <NavItem view="summary" icon="pie_chart" label="Resumen" />
            <NavItem view="profile" icon="person" label="Perfil" />
          </div>
        </nav>
      )}

      {/* SIDEBAR (PC) */}
      <nav className="hidden md:flex flex-col border-r border-slate-200 dark:border-white/5 bg-white dark:bg-surface-dark w-64 p-6 shrink-0 h-full">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <span className="material-symbols-outlined">bolt</span>
          </div>
          <h2 className="text-xl font-black tracking-tighter dark:text-white">TaskFlow <span className="text-primary">PRO</span></h2>
        </div>

        <div className="flex flex-col gap-3">
          <NavItem view="tasks" icon="format_list_bulleted" label="Tareas" />
          <NavItem view="calendar" icon="calendar_month" label="Calendario" />
          <NavItem view="summary" icon="pie_chart" label="Resumen" />
          <NavItem view="profile" icon="person" label="Perfil" />
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 dark:border-white/5 pt-6">
          <button onClick={toggleDarkMode} className="flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
            <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            <span className="text-sm font-bold">Modo {isDarkMode ? 'Claro' : 'Oscuro'}</span>
          </button>

          {/* Tarjeta de usuario con email y logout */}
          <div className="bg-slate-50 dark:bg-black/20 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-3">
              <img src={user.avatarUrl} className="w-9 h-9 rounded-full object-cover shrink-0 border-2 border-primary/20" alt="User" />
              <div className="truncate flex-1">
                <p className="text-xs font-bold truncate dark:text-white">{authUser.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{authUser.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border-t border-slate-100 dark:border-white/5"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;