<script setup lang="ts">
type Props = {
  title: string;
};

withDefaults(defineProps<Props>(), {
  title: '',
});
</script>

<template>
  <div class="relative">
    <div
      class="sticky top-0 z-10 border-y border-b-base-200 border-t-base-100 bg-base-200 px-3 py-1.5 text-sm leading-6 font-semibold text-content"
    >
      <h3>{{ title }}</h3>
    </div>
    <ul role="list" class="divide-y divide-opacity-50">
      <slot></slot>
    </ul>
  </div>
</template>
