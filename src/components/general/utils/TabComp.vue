<script setup lang="ts">
type Props = {
  id: string;
  active?: boolean;
  group?: string;
};

withDefaults(defineProps<Props>(), {
  active: false,
  group: 'tabs',
});
</script>

<template>
  <input
    :id="id"
    type="radio"
    :name="group"
    role="tab"
    class="hidden peer"
    :checked="active"
    :aria-label="id"
  />
  <label :for="id" role="tab" class="tab peer-checked:tab-active">
    <slot></slot>
  </label>

  <div
    role="tabpanel"
    class="tab-content p-4 bg-base-100 border-base-300 rounded-box peer-checked:block mt-1"
  >
    <slot name="panel"></slot>
  </div>
</template>
