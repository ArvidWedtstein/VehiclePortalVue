<script setup lang="ts">
import {
  useClickOutside,
  type AutoCloseMode,
} from '@/lib/composables/useClickOutside';
import { ref } from 'vue';

type Props = {
  btnClass?: string;
  menuClass?: string;
  /** Opens dropdown on hover */
  hover?: boolean;
  /**
   * Modes for auto-closing the dropdown.
   * - "always" - Close on any click (inside or outside).
   * - "inside" - Close only when clicked inside the target element.
   * - "outside" - Close only when clicked outside the target element.
   * - "none" - Never auto-close.
   */
  autoClose?: AutoCloseMode;
  /**
   * Direction of dropdown menu
   * @default 'bottom'
   */
  direction?: 'top' | 'bottom' | 'left' | 'right';
  alignMenu?: 'start' | 'end';
};

const props = withDefaults(defineProps<Props>(), {
  btnClass: 'btn',
  menuClass: 'w-52',
  hover: false,
  autoClose: 'always',
  direction: 'bottom',
  alignMenu: 'start',
});

const dropdownRef = ref<HTMLDivElement | null>(null);
const buttonRef = ref<HTMLButtonElement | null>(null);

const isOpen = ref(false);

useClickOutside(
  dropdownRef,
  () => {
    // const target = event.target as Node;

    if (!dropdownRef.value || !buttonRef.value) return;

    // if (!dropdownRef.value.contains(target) && !isOpen.value) return;

    isOpen.value = false;

    // buttonRef.value?.focus();
    // buttonRef.value.blur();

    // dropdownRef.value.blur();
  },
  props.autoClose,
);

const handleToggleDropdown = () => {
  isOpen.value = !isOpen.value;

  if (!isOpen.value) {
    buttonRef.value?.blur();
  }
};
</script>

<template>
  <div
    ref="dropdownRef"
    class="dropdown"
    :class="{
      'dropdown-hover': hover,
      'dropdown-open': isOpen,
      'dropdown-end': alignMenu === 'end',
    }"
  >
    <div
      ref="buttonRef"
      tabindex="0"
      role="button"
      :class="btnClass"
      v-bind="$attrs"
      @click="handleToggleDropdown"
      @click.stop
    >
      <slot>Click</slot>
    </div>
    <Transition name="dropdown" appear>
      <ul
        v-if="isOpen"
        tabindex="0"
        class="dropdown-content menu bg-base-300 rounded-box z-[1] p-2 shadow"
        :class="[menuClass]"
      >
        <slot name="items">
          <li><a>Item 1</a></li>
          <li><a>Item 2</a></li>
        </slot>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter !important;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1) !important;
  transition-duration: 0.2s !important;
}
.dropdown-enter-from,
.dropdown-leave-to {
  visibility: hidden;
  opacity: 0 !important;

  --tw-scale-x: 0.95 !important;
  --tw-scale-y: 0.95 !important;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y))
    rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y))
    scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) !important;
}
.dropdown-leave-from,
.dropdown-enter-to {
  opacity: 1 !important;
  visibility: visible;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y))
    rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y))
    scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) !important;
}
</style>
