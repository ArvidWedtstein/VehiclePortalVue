<template>
  <TransitionGroup
    name="fade"
    class="toast toast-bottom toast-end z-50"
    tag="div"
  >
    <div
      v-for="toast in toast.toasts"
      :key="toast.id"
      :class="['alert', typeClass(toast.type)]"
      @click="removeToast(toast.id)"
    >
      <span>{{ toast.message }}</span>
      <progress class="progress w-56" value="0" max="100"></progress>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { toast } from '@/lib/toastManager';
import { watch } from 'vue';
const typeClass = (type: string) => {
  // Return DaisyUI alert classes based on the type
  switch (type) {
    case 'success':
      return 'alert-success';
    case 'warning':
      return 'alert-warning';
    case 'error':
      return 'alert-error';
    default:
      return 'alert-info';
  }
};
const removeToast = (id: number) => {
  // Remove toast by ID
  console.log('remove');
  toast.removeToast(id);
};

watch(
  () => toast.toasts,
  newToasts => {
    newToasts.forEach((toastItem: { id: number; duration: number }) => {
      console.log('remove', toastItem);
      setTimeout(() => {
        toast.removeToast(toastItem.id);
      }, toastItem.duration);
    });
  },
  { immediate: true },
);
</script>

<style scoped>
/* 1. declare transition */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
  position: absolute;
}
</style>
