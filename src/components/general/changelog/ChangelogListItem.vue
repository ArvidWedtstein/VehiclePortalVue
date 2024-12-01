<script setup lang="ts">
import { relativeDate } from '@/utils/date';
type Props = {
  time?: Date | string;
  action?: string;
  actionBy: string;
  type?: 'default' | 'comment';
  avatar?: string;
};

withDefaults(defineProps<Props>(), {
  type: 'default',
});
</script>

<template>
  <li>
    <div class="relative pb-8">
      <span
        aria-hidden="true"
        class="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-500"
      ></span>
      <div
        class="relative flex space-x-3"
        :class="[type === 'default' ? 'items-center' : 'items-start']"
      >
        <div
          class="relative rounded-full overflow-hidden"
          :class="{ 'px-1': !avatar }"
        >
          <template v-if="avatar">
            <img
              v-if="avatar"
              alt=""
              src="https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=8&amp;w=256&amp;h=256&amp;q=80"
              class="flex w-10 h-10 items-center justify-center rounded-full bg-neutral ring-4 ring-transparent"
            />
            <span
              class="absolute -bottom-0.5 -right-1 rounded-tl px-0.5 py-px bg-neutral"
            >
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
          <div v-if="type === 'default'" class="text-sm text-base-content">
            <slot></slot>
            <span v-if="time" class="whitespace-nowrap float-end">{{
              relativeDate(time || '')
            }}</span>
          </div>
          <template v-else>
            <div class="text-sm">
              <div class="text-gray-300">
                <a href="#" class="font-semibold text-base-content">{{
                  actionBy
                }}</a>
              </div>
              <p class="mt-0.5 text-base-content">
                {{ action }} {{ time ? relativeDate(time, 'short') : '' }}
              </p>
            </div>
            <div class="text-sm text-neutral-content">
              <slot></slot>
            </div>
          </template>
        </div>
      </div>
    </div>
  </li>
</template>
