import React, { useState } from 'react';

interface AuthUser {
    id: string;
    name: string;
    email: string;
}

interface LoginProps {
    onAuthSuccess: (token: string, user: AuthUser) => void;
}

type Mode = 'login' | 'register';

// En dev → vacío (Vite proxy redirige /api al backend local)
// En prod → VITE_API_URL debe ser la URL del backend, ej: https://taskflow-api.onrender.com
const BASE = import.meta.env.VITE_API_URL ?? '';
const API_URL = `${BASE}/api/auth`;

const Login: React.FC<LoginProps> = ({ onAuthSuccess }) => {
    console.log('DEBUG: VITE_API_URL is:', import.meta.env.VITE_API_URL);
    console.log('DEBUG: BASE is:', BASE);
    const [mode, setMode] = useState<Mode>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setError('');
        setShowPassword(false);
    };

    const switchMode = (next: Mode) => {
        setMode(next);
        resetForm();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = mode === 'login' ? `${API_URL}/login` : `${API_URL}/register`;
            const body = mode === 'login'
                ? { email, password }
                : { name, email, password };

            const res = await fetch(endpoint, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Ha ocurrido un error');
                return;
            }

            onAuthSuccess(data.token, data.user);
        } catch {
            setError('No se pudo conectar con el servidor. ¿Está el backend corriendo?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-background-light dark:bg-background-dark overflow-hidden">

            {/* Panel izquierdo — visible solo en PC */}
            <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-pink-400 via-primary to-pink-600 p-12 relative overflow-hidden">
                {/* Círculos decorativos */}
                <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl border border-white/20">
                        <span className="material-symbols-outlined text-white text-[28px]">bolt</span>
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight">TaskFlow <span className="text-white/60">PRO</span></h1>
                </div>

                {/* Mensaje central */}
                <div className="relative z-10 space-y-6">
                    <h2 className="text-4xl font-black text-white leading-tight">
                        Organiza tu día,<br />
                        <span className="text-white/60">alcanza tus metas.</span>
                    </h2>
                    <p className="text-white/70 text-base leading-relaxed max-w-sm">
                        Crea, edita y gestiona tus tareas en cualquier dispositivo. Simple, rápido y siempre contigo.
                    </p>

                    {/* Feature pills */}
                    {['✅ Tareas sincronizadas', '📅 Vista de calendario', '📊 Resumen de progreso'].map((feat) => (
                        <div key={feat} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-white/40" />
                            <span className="text-white/80 text-sm font-medium">{feat}</span>
                        </div>
                    ))}
                </div>

                <p className="relative z-10 text-white/30 text-xs">TaskFlow PRO © 2025</p>
            </div>

            {/* Panel derecho — formulario */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md">

                    {/* Logo móvil */}
                    <div className="md:hidden flex items-center gap-2 mb-10 justify-center">
                        <div className="bg-primary p-1.5 rounded-lg text-white">
                            <span className="material-symbols-outlined">bolt</span>
                        </div>
                        <h1 className="text-xl font-black dark:text-white tracking-tight">TaskFlow <span className="text-primary">PRO</span></h1>
                    </div>

                    {/* Título */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-black dark:text-white tracking-tight">
                            {mode === 'login' ? 'Bienvenido de nuevo' : 'Crear cuenta'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                            {mode === 'login'
                                ? 'Ingresa tus credenciales para continuar'
                                : 'Rellena los datos para empezar'}
                        </p>
                    </div>

                    {/* Tabs Login / Registro */}
                    <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-xl mb-8">
                        {(['login', 'register'] as Mode[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => switchMode(m)}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === m
                                    ? 'bg-white dark:bg-surface-dark text-primary shadow-md'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
                            </button>
                        ))}
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Campo Nombre (solo en registro) */}
                        {mode === 'register' && (
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Nombre</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">person</span>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Tu nombre completo"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Campo Email */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Correo electrónico</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="correo@ejemplo.com"
                                    required
                                    autoComplete="email"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Campo Contraseña */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Contraseña</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
                                    required
                                    minLength={6}
                                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Mensaje de error */}
                        {error && (
                            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium px-4 py-3 rounded-2xl border border-red-100 dark:border-red-500/20">
                                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Botón submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-dark active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2 text-sm mt-2"
                        >
                            {loading ? (
                                <>
                                    <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                                    {mode === 'login' ? 'Entrando...' : 'Creando cuenta...'}
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[20px]">
                                        {mode === 'login' ? 'login' : 'person_add'}
                                    </span>
                                    {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Switch mode link */}
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                        {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                        <button
                            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                            className="text-primary font-bold hover:underline"
                        >
                            {mode === 'login' ? 'Regístrate gratis' : 'Inicia sesión'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
