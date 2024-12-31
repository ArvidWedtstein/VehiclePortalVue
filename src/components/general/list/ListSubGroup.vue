<script setup lang="ts">
import ListGroup from './ListGroup.vue';

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
    <ListGroup divider :overflow="false">
      <slot></slot>
    </ListGroup>
  </div>
</template>
