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

const props = withDefaults(defineProps<Props>(), {
  active: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent) => {
  if (props.href || props.to) {
    return;
  }

  emit('click', event);
};
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
      @click="handleClick"
      :class="{ disabled: disabled, active: active }"
    >
      <slot></slot>
    </component>
  </li>
</template>
