import React, { useState, useEffect } from 'react';
import { View, Task, UserProfile, TaskStatus, Priority } from './types';
import { INITIAL_TASKS, INITIAL_USER } from './constants';
import TaskList from './pages/TaskList';
import TaskEdit from './pages/TaskEdit';
import Profile from './pages/Profile';
import CalendarView from './pages/CalendarView';
import Summary from './pages/Summary';
import NavBar from './components/NavBar';
import ConfirmModal from './components/ConfirmModal';
import Login from './pages/Login';

// ── Tipos de autenticación ─────────────────────────────────────────────────
interface AuthUser {
  id: string;
  name: string;
  email: string;
}

// ── Hook genérico para persistir en localStorage ────────────────────────────
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch { /* cuota excedida u otro error */ }
  }, [key, state]);

  return [state, setState];
}

// ── App ─────────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  // ── Auth ──
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('taskflow-token'));
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('taskflow-auth-user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  // ── App state ──
  const [currentView, setCurrentView] = useState<View>('tasks');
  const [tasks, setTasks] = useLocalStorage<Task[]>('taskflow-tasks', INITIAL_TASKS);
  const [user, setUser] = useLocalStorage<UserProfile>('taskflow-user', {
    ...INITIAL_USER,
    name: authUser?.name ?? INITIAL_USER.name,
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('taskflow-darkmode') === 'true');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Aplicar modo oscuro al montar
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // ── Handlers de autenticación ──────────────────────────────────────────────
  const handleAuthSuccess = (token: string, u: AuthUser) => {
    localStorage.setItem('taskflow-token', token);
    localStorage.setItem('taskflow-auth-user', JSON.stringify(u));
    setAuthToken(token);
    setAuthUser(u);
    // Sincronizar el nombre del perfil con el usuario autenticado
    setUser((prev) => ({ ...prev, name: u.name }));
  };

  const handleLogout = () => {
    localStorage.removeItem('taskflow-token');
    localStorage.removeItem('taskflow-auth-user');
    setAuthToken(null);
    setAuthUser(null);
    setCurrentView('tasks');
  };

  // ── Si no hay sesión, mostrar login ───────────────────────────────────────
  if (!authToken || !authUser) {
    return <Login onAuthSuccess={handleAuthSuccess} />;
  }

  // ── Handlers de tareas ─────────────────────────────────────────────────────
  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('taskflow-darkmode', String(next));
    document.documentElement.classList.toggle('dark');
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === TaskStatus.PENDING ? TaskStatus.COMPLETED : TaskStatus.PENDING } : t
    ));
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setCurrentView('edit-task');
  };

  const handleRequestDelete = (id: string) => setConfirmDeleteId(id);

  const handleConfirmDelete = () => {
    if (!confirmDeleteId) return;
    setTasks(prev => prev.filter(t => t.id !== confirmDeleteId));
    if (currentView === 'edit-task') setCurrentView('tasks');
    setConfirmDeleteId(null);
  };

  const handleSaveTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setCurrentView('tasks');
  };

  const handleAddTask = (title: string = '') => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: title || 'Nueva tarea',
      description: '',
      status: TaskStatus.PENDING,
      priority: Priority.LOW,
      dueDate: 'Hoy',
      createdAt: new Date().toLocaleDateString('es-ES'),
    };
    setTasks(prev => [newTask, ...prev]);
    if (!title) {
      setSelectedTask(newTask);
      setCurrentView('edit-task');
    }
  };

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    setCurrentView('tasks');
  };

  // ── Renderizado de vistas ─────────────────────────────────────────────────
  const renderContent = () => {
    switch (currentView) {
      case 'tasks':
        return <TaskList tasks={tasks} user={user} onToggleTask={handleToggleTask} onEditTask={handleEditTask} onDeleteTask={handleRequestDelete} onAddTask={handleAddTask} onGoToProfile={() => setCurrentView('profile')} />;
      case 'calendar':
        return <CalendarView tasks={tasks} />;
      case 'summary':
        return <Summary tasks={tasks} />;
      case 'profile':
        return <Profile user={user} onSave={handleUpdateProfile} onBack={() => setCurrentView('tasks')} />;
      case 'edit-task':
        return selectedTask
          ? <TaskEdit task={selectedTask} onSave={handleSaveTask} onCancel={() => setCurrentView('tasks')} onDelete={handleRequestDelete} />
          : <TaskList tasks={tasks} user={user} onToggleTask={handleToggleTask} onEditTask={handleEditTask} onDeleteTask={handleRequestDelete} onAddTask={handleAddTask} onGoToProfile={() => setCurrentView('profile')} />;
      default:
        return <TaskList tasks={tasks} user={user} onToggleTask={handleToggleTask} onEditTask={handleEditTask} onDeleteTask={handleRequestDelete} onAddTask={handleAddTask} onGoToProfile={() => setCurrentView('profile')} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      <NavBar
        currentView={currentView}
        onViewChange={setCurrentView}
        onAddTask={() => handleAddTask()}
        user={user}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
        onLogout={handleLogout}
        authUser={authUser}
      />

      <main className="flex-1 h-full overflow-hidden relative pt-14 md:pt-0">
        {renderContent()}
      </main>

      {confirmDeleteId && (
        <ConfirmModal
          title="¿Eliminar esta tarea?"
          message="Esta acción no se puede deshacer. La tarea desaparecerá permanentemente de tu lista."
          confirmLabel="Sí, eliminar"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
};

export default App;