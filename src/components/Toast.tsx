'use client';

import { useEffect, useState } from 'react';
import type { ToastMessage } from '@/lib/types';

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export default function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2500);
    const removeTimer = setTimeout(() => onRemove(toast.id), 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.id, onRemove]);

  const bgColor =
    toast.type === 'error'
      ? 'bg-red-600 dark:bg-red-700'
      : 'bg-yellow-500 dark:bg-yellow-600';

  return (
    <div
      className={`${bgColor} min-w-[280px] max-w-[400px] rounded-lg px-4 py-3 text-sm text-white shadow-lg`}
      style={{
        animation: fading ? 'fadeOut 0.5s ease forwards' : 'fadeIn 0.3s ease',
      }}
    >
      {toast.message}
    </div>
  );
}
