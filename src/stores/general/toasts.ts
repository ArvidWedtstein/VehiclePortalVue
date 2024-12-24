import { defineStore } from 'pinia';
import { ref } from 'vue';

export type Severity = 'default' | 'success' | 'info' | 'error' | 'warning';
type Toast = {
  id: number;
  message: string;
  severity: Severity;
  duration?: number;
};

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Array<Toast>>([]);

  const addToast = (
    message: string,
    severity: Severity = 'default',
    duration?: number,
  ) => {
    const id = Date.now();
    toasts.value.push({
      id,
      message,
      severity,
      duration,
    });

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: Toast['id']) => {
    toasts.value = toasts.value.filter(toast => toast.id !== id);
  };

  return { toasts, addToast, removeToast };
});
