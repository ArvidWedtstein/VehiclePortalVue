<script setup lang="ts">
import type {
  RouteLocationAsPathGeneric,
  RouteLocationAsRelativeGeneric,
} from 'vue-router';

type Props = {
  imageUrl?: string;
  imageClass?: string;

  title?: string | null;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  as?: 'a' | 'button' | 'RouterLink';
  noHoverEffect?: boolean;
  to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
};

withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  as: 'a',
  noHoverEffect: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<template>
  <li>
    <component class="flex items-center" :class="{
      'hover:bg-transparent': noHoverEffect,
      'p-3 gap-x-2': size === 'sm',
      'px-4 py-5 gap-x-2 md:gap-x-4': size === 'md',
    }" v-bind="as === 'button'
      ? { type: 'button', ...$attrs }
      : as === 'RouterLink'
        ? { to: to, ...$attrs }
        : $attrs
      " :is="as" @click="handleClick">
      <slot name="icon" :sizeClass="{
        'w-10 h-10': size === 'sm',
        'size-10 md:size-12': size === 'md',
        'size-12 md:size-14': size === 'lg',
      }">
        <img v-show="!!imageUrl" alt="" :src="imageUrl" class="flex-none rounded-full bg-base-100 object-cover" :class="[imageClass, {
          'w-10 h-10': size === 'sm',
          'size-10 md:size-12': size === 'md',
          'w-14 h-14': size === 'lg',
        }]" />
      </slot>

      <div class="min-w-0 grow">
        <p class="text-base leading-6 font-semibold text-base-content flex items-center gap-1">
          <slot name="title">
            {{ title }}
          </slot>
        </p>

        <div class="text-gray-400 leading-5 text-sm flex gap-1 items-center">
          <slot name="subtitle">
            <p v-if="subtitle" class="overflow-hidden text-ellipsis whitespace-nowrap text-xs" :class="{
              'mt-1': size === 'md' || size === 'lg',
            }">
              {{ subtitle }}
            </p>
          </slot>
        </div>
      </div>
      <slot name="endIcon"></slot>
    </component>
  </li>
</template>
