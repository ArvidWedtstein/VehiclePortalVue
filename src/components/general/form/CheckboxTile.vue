<template>
  <label class="position-relative">
    <input
      :type="type"
      class="checkbox-input hidden"
      v-model="vModelValue"
      :value="value || label"
      v-bind="$attrs"
    />
    <span
      class="flex flex-col justify-center items-center relative rounded-md checkbox-tile gap-1"
      :class="vComputedTileClass"
    >
      <i
        v-if="icon"
        class="text-lg mb-0 bi"
        :class="icon"
        style="transition: 0.375s ease"
      ></i>
      <span class="text-center" style="transition: 0.375s ease">
        <slot>{{ label }}</slot>
      </span>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, defineModel, withDefaults } from 'vue';

type Props = {
  label?: string;
  icon?: string;
  value?: string | number;
  type?: 'checkbox' | 'radio';
};

const vProps = withDefaults(defineProps<Props>(), {
  label: '',
  type: 'checkbox',
});

const vModelValue = defineModel<string | number | null | undefined>({
  required: true,
});

const vComputedTileClass = computed(() => {
  const vIsChecked = Array.isArray(vModelValue.value)
    ? vModelValue.value.includes(vProps.value || '')
    : vModelValue.value === vProps.value;

  return {
    'text-primary border border-primary': vIsChecked,
    'text-neutral-content border border-neutral-content': !vIsChecked,
  };
});
</script>

<style scoped>
.checkbox-input:checked + .checkbox-tile:before {
  transform: scale(1);
  opacity: 1;
  background-color: oklch(var(--p));
  border: 1px solid oklch(var(--p));
}
.checkbox-input:focus + .checkbox-tile {
  border-color: oklch(var(--p));
}
.checkbox-input:focus + .checkbox-tile:before {
  transform: scale(1);
  opacity: 1;
}
.checkbox-tile {
  width: 5rem;
  min-height: 5rem;
  transition: 0.15s ease;
  cursor: pointer;
}
.checkbox-tile:before {
  content: '';
  position: absolute;
  display: block;
  width: 0.75rem;
  height: 0.75rem;
  border: 1px solid;
  border-radius: 50%;
  top: 0.25rem;
  left: 0.25rem;
  padding: 0.5rem;
  opacity: 0;
  transform: scale(0);
  transition: 0.25s ease;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='192' style='width: 0.5rem;' fill='%23FFFFFF' viewBox='0 0 256 256'%3E%3Crect width='256' height='256' fill='none'%3E%3C/rect%3E%3Cpolyline points='216 72.005 104 184 48 128.005' fill='none' stroke='%23FFFFFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'%3E%3C/polyline%3E%3C/svg%3E");
  background-size: 12px;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}

.checkbox-tile:hover:before {
  transform: scale(1);
  opacity: 1;
}
</style>
