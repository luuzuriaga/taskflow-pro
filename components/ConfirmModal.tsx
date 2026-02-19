import React from 'react';

interface ConfirmModalProps {
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    title,
    message,
    confirmLabel = 'Eliminar',
    onConfirm,
    onCancel,
}) => {
    return (
        // Overlay con backdrop-blur
        <div
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 md:p-6"
            role="dialog"
            aria-modal="true"
        >
            {/* Fondo oscuro semitransparente */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Panel del modal */}
            <div className="relative w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl shadow-2xl p-6 flex flex-col gap-5 animate-in slide-in-from-bottom-4 duration-300">

                {/* Icono de advertencia */}
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 mx-auto">
                    <span className="material-symbols-outlined text-[36px] text-red-500">
                        delete_forever
                    </span>
                </div>

                {/* Texto */}
                <div className="text-center space-y-1.5">
                    <h2 className="text-lg font-black dark:text-white tracking-tight">{title}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{message}</p>
                </div>

                {/* Botones */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        className="w-full bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                        {confirmLabel}
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 active:scale-95 text-slate-700 dark:text-slate-300 font-bold py-3.5 rounded-2xl transition-all"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
