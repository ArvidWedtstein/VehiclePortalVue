<script setup lang="ts">
type Props = {
  ignoreListClass?: boolean;
  rounded?: boolean;
  overflow?: boolean;
  divider?: boolean;
};

withDefaults(defineProps<Props>(), {
  ignoreListClass: false,
  rounded: false,
  divider: false,
  overflow: true,
});
</script>

<template>
  <div
    role="list"
    :class="{
      menu: !ignoreListClass,
      'divide-y divide-neutral divide-opacity-75': divider,
      '[&_li>*]:rounded-none p-0': !rounded,
      'overflow-y-auto': overflow,
    }"
  >
    <slot></slot>
  </div>
</template>
