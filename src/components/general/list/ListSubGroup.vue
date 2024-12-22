<script setup lang="ts">
type Props = {
  title: string;
  sticky?: boolean;
};

withDefaults(defineProps<Props>(), {
  title: '',
  sticky: false,
});
</script>

<template>
  <div class="relative">
    <div
      class="z-10 border-y border-b-neutral border-t-base-100 bg-base-200/50 px-3 py-1.5 text-sm leading-6 font-semibold text-content"
      :class="{ 'sticky top-0': sticky }"
    >
      <h3>{{ title }}</h3>
    </div>
    <ul
      role="list"
      class="menu p-0 [&_li>*]:rounded-none divide-y divide-neutral divide-opacity-75"
    >
      <slot></slot>
    </ul>
  </div>
</template>
