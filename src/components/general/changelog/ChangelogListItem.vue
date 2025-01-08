<script setup lang="ts">
import { relativeDate } from '@/utils/date';
import { computed } from 'vue';
import AvatarImage from '../utils/AvatarImage.vue';

type Props = {
  time?: Date | string | null;
  action?: string;
  actionBy?: string | null;
  type?: 'default' | 'comment';
  avatar?: string | null;
};

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
});

const actionByUser = computed(() => props.actionBy || 'Unknown User');

const actionText = computed(() => {
  return `
    <a
      href="#"
      class="font-semibold text-base-content text-nowrap"
    >${actionByUser.value}</a>
    ${
      props.type === 'default'
        ? props.action
        : `<p class="mt-0.5 text-base-content capitalize">
            ${props.action} <span class="ms-auto float-end opacity-50">${props.time ? relativeDate(props.time, 'narrow') : ''}</span>
    </p>`
    }
`;
});
</script>

<template>
  <li class="group">
    <div class="relative pb-8">
      <span
        aria-hidden="true"
        class="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-500 group-last:hidden"
      ></span>
      <div
        class="relative flex space-x-3"
        :class="[type === 'default' ? 'items-center' : 'items-start']"
      >
        <div class="relative" :class="{ 'px-1': !avatar && !actionByUser }">
          <template v-if="avatar || actionByUser">
            <AvatarImage
              size="sm"
              :fallbackSrc="`https://ui-avatars.com/api/?name=${actionByUser}`"
            />

            <span class="absolute -bottom-0.5 -right-1 rounded-tl px-0.5 py-px">
              <slot name="icon"></slot>
            </span>
          </template>

          <div
            v-else
            class="flex w-8 h-8 items-center justify-center rounded-full bg-neutral-content"
          >
            <slot name="icon"></slot>
          </div>
        </div>
        <div class="min-w-0 flex-1" :class="{ 'py-1.5': type === 'default' }">
          <div
            v-if="type === 'default'"
            class="text-sm text-base-content text-wrap inline-flex gap-1 w-full"
          >
            <div v-html="actionText"></div>

            <slot></slot>
            <span
              v-if="time"
              class="whitespace-nowrap float-end ms-auto opacity-50"
              >{{ relativeDate(time, 'narrow') }}</span
            >
          </div>
          <template v-else>
            <div class="text-sm" v-html="actionText"></div>
            <div class="text-sm text-neutral-content">
              <slot></slot>
            </div>
          </template>
        </div>
      </div>
    </div>
  </li>
</template>
