<script setup lang="ts">
type Props = {
  imageUrl?: string;
  title: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  as?: 'a' | 'button';
};

withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  as: 'a',
});

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>

<template>
  <li>
    <component
      class="flex items-center"
      :class="{
        'px-2 py-3 gap-x-2': size === 'sm',
        'px-3 py-5 gap-x-4': size === 'md',
      }"
      :is="as"
      type="button"
      v-bind="$attrs"
      @click="($event: MouseEvent) => $emit('click', $event)"
    >
      <img
        v-if="imageUrl"
        alt=""
        :src="imageUrl"
        class="flex-none rounded-full bg-base-100"
        :class="{
          'w-10 h-10': size === 'sm',
          'w-12 h-12': size === 'md',
          'w-14 h-14': size === 'lg',
        }"
      />
      <div class="min-w-0 grow">
        <slot name="title"
          ><p class="text-sm leading-6 font-semibold text-neutral-content">
            {{ title }}
          </p>
        </slot>

        <slot name="subtitle">
          <p
            v-if="subtitle"
            class="overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-5 text-gray-500"
            :class="{
              'mt-1': size === 'md' || size === 'lg',
            }"
          >
            {{ subtitle }}
          </p>
        </slot>
      </div>
      <slot name="icon"></slot>
    </component>
  </li>
</template>
