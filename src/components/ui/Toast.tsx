import React, { useEffect } from 'react';
import { ToastMessage } from '../../types';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length === 0) return;

    const timer = setTimeout(() => {
      onDismiss(toasts[0].id);
    }, 4500);

    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-10 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-4 h-4 text-accent-electric shrink-0" />;
        let borderClass = 'border-carbon-700';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
          borderClass = 'border-emerald-500/40';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
          borderClass = 'border-amber-500/40';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
          borderClass = 'border-rose-500/40';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded bg-carbon-900/95 backdrop-blur-sm border ${borderClass} shadow-xl text-xs transition-all animate-in fade-in slide-in-from-bottom-2 duration-200`}
            role="alert"
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1">
              <div className="font-semibold text-carbon-100 tracking-tight">{toast.title}</div>
              {toast.description && (
                <div className="text-carbon-400 mt-1 leading-relaxed font-mono text-[11px]">
                  {toast.description}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-carbon-500 hover:text-carbon-300 p-0.5 rounded transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
