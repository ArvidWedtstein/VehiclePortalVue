<script setup lang="ts">
type Props = {
  imageUrl?: string;
  title: string;
  subtitle?: string;
};

withDefaults(defineProps<Props>(), {
  title: '',
});
</script>

<template>
  <li class="flex gap-x-4 px-3 py-5">
    <img
      v-if="imageUrl"
      alt=""
      :src="imageUrl"
      class="h-12 w-12 flex-none rounded-full bg-base-100"
    />
    <div class="min-w-0">
      <slot name="title"
        ><p class="text-sm leading-6 font-semibold text-neutral-content">
          {{ title }}
        </p></slot
      >

      <slot name="subtitle">
        <p
          v-if="subtitle"
          class="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-5 text-gray-500"
        >
          {{ subtitle }}
        </p>
      </slot>
    </div>
  </li>
</template>
