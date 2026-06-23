import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { ToastEntry, ToastType } from '../types';

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
  entries: ToastEntry[];
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<ToastEntry[]>([]);
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: number) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
    const timer = timers.current[id];
    if (timer) {
      clearTimeout(timer);
      delete timers.current[id];
    }
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = nextId++;
      setEntries((current) => [...current, { id, message, type }]);
      timers.current[id] = setTimeout(() => dismiss(id), 2800);
    },
    [dismiss],
  );

  useEffect(() => {
    const cached = timers.current;
    return () => {
      Object.values(cached).forEach(clearTimeout);
    };
  }, []);

  return <ToastContext.Provider value={{ toast, entries, dismiss }}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue['toast'] {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context.toast;
}

export function useToastEntries(): ToastEntry[] {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToastEntries must be used within ToastProvider');
  return context.entries;
}

export function useToastDismiss(): ToastContextValue['dismiss'] {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToastDismiss must be used within ToastProvider');
  return context.dismiss;
}
