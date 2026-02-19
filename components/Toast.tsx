import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    icon?: string;
    onDone: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, icon = 'check_circle', onDone, duration = 2500 }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Fade-in rápido
        const showTimer = setTimeout(() => setVisible(true), 10);

        // Fade-out antes de desaparecer
        const hideTimer = setTimeout(() => setVisible(false), duration - 400);

        // Limpiar componente
        const doneTimer = setTimeout(() => onDone(), duration);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
            clearTimeout(doneTimer);
        };
    }, [duration, onDone]);

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-6 pointer-events-none">
            <div
                className={`
          flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900
          px-5 py-4 rounded-2xl shadow-2xl
          transition-all duration-400
          ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
        `}
            >
                <span className="material-symbols-outlined text-[24px] text-green-400 dark:text-green-600">
                    {icon}
                </span>
                <span className="font-bold text-sm">{message}</span>
            </div>
        </div>
    );
};

export default Toast;
