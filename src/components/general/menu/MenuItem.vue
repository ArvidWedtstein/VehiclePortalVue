<script setup lang="ts">
import type {
  RouteLocationAsPathGeneric,
  RouteLocationAsRelativeGeneric,
} from 'vue-router';
type Props = {
  active?: boolean;
  disabled?: boolean;
  href?: string;
  to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
};

withDefaults(defineProps<Props>(), {
  active: false,
  disabled: false,
});
</script>

<template>
  <li>
    <component
      :is="href ? 'a' : to ? 'RouterLink' : 'button'"
      v-bind="
        !href && !to
          ? { type: 'button', disabled: disabled, ...$attrs }
          : to
            ? { to: to, ...$attrs }
            : $attrs
      "
      :class="{ disabled: disabled, active: active }"
    >
      <slot></slot>
    </component>
  </li>
</template>
