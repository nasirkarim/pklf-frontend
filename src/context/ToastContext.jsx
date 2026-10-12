import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    success: (msg, duration) => showToast(msg, 'success', duration),
    error: (msg, duration) => showToast(msg, 'error', duration),
    info: (msg, duration) => showToast(msg, 'info', duration),
    warning: (msg, duration) => showToast(msg, 'warning', duration),
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
        };
      case 'error':
        return {
          container: 'bg-rose-50 border-rose-200 text-rose-900',
          icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
        };
      case 'warning':
        return {
          container: 'bg-amber-50 border-amber-200 text-amber-900',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
        };
      case 'info':
      default:
        return {
          container: 'bg-slate-900 border-slate-800 text-white',
          icon: <Info className="w-5 h-5 text-emerald-400 shrink-0" />,
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, toast }}>
      {children}
      {/* Toast Notification Container */}
      <aside
        aria-label="Notifications"
        aria-live="polite"
        className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0 pointer-events-none"
      >
        {toasts.map((t) => {
          const { container, icon } = getToastStyles(t.type);
          return (
            <div
              key={t.id}
              role={t.type === 'error' ? 'alert' : 'status'}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-lg transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${container}`}
            >
              {icon}
              <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
                {t.message}
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="opacity-70 hover:opacity-100 transition p-0.5 rounded-lg -mr-1 -mt-1 cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </aside>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
