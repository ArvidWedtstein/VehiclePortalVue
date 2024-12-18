<script setup lang="ts">
import { ref, computed } from 'vue';

const isDrawerOpen = ref(false);
const startPoint = ref(0);
const currentPoint = ref(0);
const isSwiping = ref(false);

type Props = {
  title?: string;
  /** Default left */
  direction?: 'bottom' | 'top' | 'left' | 'right';
};
const props = withDefaults(defineProps<Props>(), {
  direction: 'left',
});

const toggleDrawer = (open: boolean = false) => {
  isDrawerOpen.value = open;
};

const drawerClasses = computed(() => {
  switch (props.direction) {
    case 'top':
      return 'top-0 left-0 w-full transform rounded-b-box';
    case 'bottom':
      return 'bottom-0 left-0 w-full transform rounded-t-box';
    case 'left':
      return 'top-16 left-0 h-full transform rounded-r-box ';
    case 'right':
      return 'top-16 right-0 h-full transform rounded-l-box';
    default:
      return '';
  }
});

const drawerTransform = computed(() => {
  switch (props.direction) {
    case 'top':
      return isDrawerOpen.value ? 'translate-y-0' : 'translate-y-[-100%]';
    case 'bottom':
      return isDrawerOpen.value ? 'translate-y-0' : 'translate-y-full';
    case 'left':
      return isDrawerOpen.value ? 'translate-x-0' : 'translate-x-[-100%]';
    case 'right':
      return isDrawerOpen.value ? 'translate-x-0' : 'translate-x-full';
    default:
      return '';
  }
});

const onTouchStart = (event: TouchEvent) => {
  startPoint.value =
    props.direction === 'left' || props.direction === 'right'
      ? event.touches[0].clientX
      : event.touches[0].clientY;
  isSwiping.value = true;
};

const onTouchMove = (event: TouchEvent) => {
  if (!isSwiping.value) return;
  currentPoint.value =
    props.direction === 'left' || props.direction === 'right'
      ? event.touches[0].clientX
      : event.touches[0].clientY;
};

const onTouchEnd = () => {
  if (!isSwiping.value) return;

  const delta = currentPoint.value - startPoint.value;
  const threshold = 50;

  if (props.direction === 'bottom' && delta > threshold) toggleDrawer(false);
  if (props.direction === 'top' && delta < -threshold) toggleDrawer(false);
  if (props.direction === 'left' && delta < -threshold) toggleDrawer(false);
  if (props.direction === 'right' && delta > threshold) toggleDrawer(false);

  if (props.direction === 'bottom' && delta < -threshold) toggleDrawer(true);
  if (props.direction === 'top' && delta > threshold) toggleDrawer(true);
  if (props.direction === 'left' && delta > threshold) toggleDrawer(true);
  if (props.direction === 'right' && delta < -threshold) toggleDrawer(true);

  isSwiping.value = false;
  startPoint.value = 0;
  currentPoint.value = 0;
};
</script>

<template>
  <div class="relative">
    <button
      @click="toggleDrawer(true)"
      class="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
    >
      Open Drawer
    </button>

    <Transition name="fade">
      <div
        v-if="isDrawerOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        @click="toggleDrawer()"
      ></div>
    </Transition>

    <Transition
      :name="
        direction === 'left' || direction === 'right'
          ? 'slide-horizontal'
          : 'slide'
      "
    >
      <div
        v-if="isDrawerOpen"
        class="fixed z-50 bg-base-200 text-base-content shadow-lg"
        :class="[drawerClasses, drawerTransform]"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div class="p-4">
          <h2 v-if="title" class="text-lg font-bold">{{ title }}</h2>
          <div class="grow">
            <slot></slot>
          </div>
          <button @click="toggleDrawer()" class="btn btn-sm btn-outline mt-2">
            Close
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Overlay fade-in/out animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-leave-from,
.fade-enter-to {
  opacity: 1;
}

/* Drawer slide animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
}
.slide-leave-from,
.slide-enter-to {
  transform: translateY(0);
}

/* Horizontal slide animation */
.slide-horizontal-enter-active,
.slide-horizontal-leave-active {
  transition: transform 0.3s ease;
}
.slide-horizontal-enter-from,
.slide-horizontal-leave-to {
  transform: translateX(-100%);
}
.slide-horizontal-leave-from,
.slide-horizontal-enter-to {
  transform: translateX(0);
}
</style>
