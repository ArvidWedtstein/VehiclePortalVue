<script setup lang="ts">
type Props = {
  ignoreListClass?: boolean;
  rounded?: boolean;
};

withDefaults(defineProps<Props>(), {
  ignoreListClass: false,
  rounded: false,
});
</script>

<template>
  <div
    role="list"
    class="overflow-y-auto"
    :class="{
      'menu divide-y divide-neutral divide-opacity-75': !ignoreListClass,
      '[&_li>*]:rounded-none p-0': !rounded,
    }"
  >
    <slot></slot>
  </div>
</template>
