"use client";

import { useEffect, useState } from "react";
import { Button } from "react-aria-components";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed right-4 bottom-4 z-50 flex flex-col gap-2"
      role="region"
      aria-live="polite"
      aria-label="Notificaciones"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss después de 5 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(toast.id), 300); // Esperar animación
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  if (!isVisible) return null;

  const typeStyles = {
    success: "bg-blue-900/30 border-blue-600 text-blue-100",
    error: "bg-red-900/30 border-red-600 text-red-100",
    info: "bg-blue-900/30 border-blue-600 text-blue-100",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out",
        typeStyles[toast.type],
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
      )}
      role="alert"
    >
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <Button
        onPress={() => {
          setIsVisible(false);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        className="text-current opacity-70 transition-opacity hover:cursor-pointer hover:opacity-100"
        aria-label="Cerrar notificación"
      >
        <XMarkIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}

/**
 * Hook para gestionar toasts desde componentes
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    showToast,
    dismissToast,
    showSuccess: (message: string) => showToast(message, "success"),
    showError: (message: string) => showToast(message, "error"),
    showInfo: (message: string) => showToast(message, "info"),
  };
}
