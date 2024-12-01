<script setup lang="ts">
import { relativeDate } from '@/utils/date';

type Props = {
  sent?: Date | string;
};

withDefaults(defineProps<Props>(), {});
</script>

<template>
  <li class="relative flex gap-x-4">
    <div class="-bottom-6 absolute left-0 top-0 flex w-6 justify-center">
      <div class="w-px bg-gray-500"></div>
    </div>
    <div
      class="relative flex w-6 h-6 flex-none items-center justify-center bg-base-100"
    >
      <div
        class="w-2.5 h-2.5 rounded-full bg-base-100 ring-neutral-content ring-1 ring-inset"
      ></div>
    </div>
    <p class="flex-auto py-0.5 text-xs text-gray-500">
      <span class="font-medium text-gray-300">Chelsea Hagon</span> created the
      invoice.
    </p>
    <time
      v-if="sent"
      :datetime="sent instanceof Date ? relativeDate(sent) : sent"
      class="flex-none py-0.5 text-xs text-gray-500"
      >{{ relativeDate(sent) }}</time
    >
  </li>
</template>
