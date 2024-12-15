<script setup lang="ts">
type Props = {
  active?: boolean;
  disabled?: boolean;
  href?: string;
};

withDefaults(defineProps<Props>(), {
  active: false,
  disabled: false,
});
</script>

<template>
  <li>
    <component
      :is="href ? 'a' : 'button'"
      v-bind="
        !href ? { type: 'button', disabled: disabled, ...$attrs } : $attrs
      "
      :class="{ disabled: disabled, active: active }"
    >
      <slot></slot>
    </component>
  </li>
</template>
