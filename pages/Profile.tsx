
import React, { useState } from 'react';
import { UserProfile } from '../types';
import Toast from '../components/Toast';

interface ProfileProps {
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
  onBack: () => void;
}

const BASE = import.meta.env.VITE_API_URL ?? '';
const API_URL = `${BASE}/api/auth`;

const Profile: React.FC<ProfileProps> = ({ user, onSave, onBack }) => {
  const [editedUser, setEditedUser] = useState<UserProfile>({ ...user });
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('taskflow-token');
      const res = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedUser)
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('SERVER ERROR:', res.status, errorData);
        throw new Error(errorData.message || 'Error al actualizar perfil');
      }

      onSave(editedUser);
      setShowToast(true);

      // Volver atrás después de mostrar el toast
      setTimeout(() => {
        onBack();
      }, 1500);

    } catch (error) {
      console.error(error);
      alert('Error al guardar los cambios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-background-light dark:bg-background-dark">
      <header className="flex-none bg-gradient-to-br from-primary to-background-dark pt-12 pb-6 px-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10 flex justify-between items-center mb-2">
          <button onClick={onBack} className="text-white/80 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[2.8rem]">arrow_back</span>
          </button>
          <h1 className="text-[2rem] font-black text-white tracking-tight">Mi Perfil</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative bg-background-light dark:bg-background-dark -mt-4 rounded-t-3xl overflow-hidden shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
        <div className="w-full max-w-md mx-auto px-6 py-8 pb-32 flex-1 overflow-y-auto hide-scrollbar">
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm p-8 space-y-6 border border-slate-100 dark:border-white/5">
            <h2 className="text-[1.5rem] font-bold text-slate-800 dark:text-white mb-6 text-center">Configuración de Perfil</h2>

            <form className="space-y-5">
              <div className="space-y-2 text-left">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nombre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                  <input
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border-slate-200 dark:border-white/10 rounded-xl text-sm focus:ring-primary focus:border-primary bg-slate-50 dark:bg-black/20 dark:text-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Apellidos
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">badge</span>
                  </div>
                  <input
                    value={editedUser.lastName}
                    onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border-slate-200 dark:border-white/10 rounded-xl text-sm focus:ring-primary focus:border-primary bg-slate-50 dark:bg-black/20 dark:text-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  URL de la imagen de perfil
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">link</span>
                  </div>
                  <input
                    value={editedUser.avatarUrl}
                    onChange={(e) => setEditedUser({ ...editedUser, avatarUrl: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border-slate-200 dark:border-white/10 rounded-xl text-sm focus:ring-primary focus:border-primary bg-slate-50 dark:bg-black/20 dark:text-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-center py-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-4 border-white dark:border-surface-dark shadow-lg overflow-hidden relative bg-slate-100">
                    <img alt="Vista previa del avatar" className="w-full h-full object-cover" src={editedUser.avatarUrl} />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md border-2 border-white dark:border-surface-dark cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] text-sm flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">save</span>
                  )}
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Toast de confirmación */}
      {showToast && (
        <Toast
          message="¡Perfil guardado correctamente!"
          icon="check_circle"
          onDone={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default Profile;
