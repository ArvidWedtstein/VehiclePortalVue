import { reactive } from 'vue';

export const toast = reactive({
  toasts: [] as {
    id: number;
    message: string;
    duration: number;
    type: string;
  }[], // Stack of toasts

  // Trigger a toast with cooldown and stacking support
  triggerToast(message = '', type = 'info', duration = 2000) {
    this.toasts.push({ id: Date.now(), message, type, duration });
  },

  // Method to remove a toast from the stack by its ID
  removeToast(id: number) {
    console.log('remove toast', id, this.toasts);
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  },
});
