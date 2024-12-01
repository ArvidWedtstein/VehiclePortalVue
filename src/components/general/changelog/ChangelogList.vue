<script setup lang="ts">
import ChangelogListItem from './ChangelogListItem.vue';
</script>

<template>
  <ul role="list" class="space-y-6">
    <slot></slot>
    <ChangelogListItem></ChangelogListItem>
    <li class="relative flex gap-x-4">
      <div class="-bottom-6 absolute left-0 top-0 flex w-6 justify-center">
        <div class="w-px bg-gray-500"></div>
      </div>
      <div
        class="relative flex w-6 h-6 flex-none items-center justify-center bg-base-100"
      >
        <div
          class="w-2.5 h-2.5 rounded-full bg-base-100 ring-neutral-content ring-1 ring-inset"
        ></div>
      </div>
      <p class="flex-auto py-0.5 text-xs text-gray-500">
        <span class="font-medium text-gray-300">Chelsea Hagon</span> created the
        invoice.
      </p>
      <time
        datetime="2023-01-23T10:32"
        class="flex-none py-0.5 text-xs text-gray-500"
        >7d ago</time
      >
    </li>
    <li class="relative flex gap-x-4">
      <div class="-bottom-6 absolute left-0 top-0 flex w-6 justify-center">
        <div class="w-px bg-gray-500"></div>
      </div>
      <div
        class="relative flex w-6 h-6 flex-none items-center justify-center bg-base-100"
      >
        <div
          class="w-2.5 h-2.5 rounded-full bg-base-100 ring-neutral-content ring-1 ring-inset"
        ></div>
      </div>
      <p class="flex-auto py-0.5 text-xs text-gray-500">
        <span class="font-medium text-gray-300">Chelsea Hagon</span> edited the
        invoice.
      </p>
      <time
        datetime="2023-01-23T11:03"
        class="flex-none py-0.5 text-xs text-gray-500"
        >6d ago</time
      >
    </li>
    <li class="relative flex gap-x-4">
      <div class="-bottom-6 absolute left-0 top-0 flex w-6 justify-center">
        <div class="w-px bg-gray-500"></div>
      </div>
      <div
        class="relative flex w-6 h-6 flex-none items-center justify-center bg-base-100"
      >
        <div
          class="w-2.5 h-2.5 rounded-full bg-base-100 ring-neutral-content ring-1 ring-inset-inset"
        ></div>
      </div>
      <p class="flex-auto py-0.5 text-xs text-gray-500">
        <span class="font-medium text-gray-300">Chelsea Hagon</span> sent the
        invoice.
      </p>
      <time
        datetime="2023-01-23T11:24"
        class="flex-none py-0.5 text-xs text-gray-500"
        >6d ago</time
      >
    </li>
    <li class="relative flex gap-x-4">
      <div class="-bottom-6 absolute left-0 top-0 flex w-6 justify-center">
        <div class="w-px bg-gray-500"></div>
      </div>
      <img
        alt=""
        src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;-bottom-6=256&amp;q=80"
        class="relative kp w-6 h-6 flex-none rounded-full ajh"
      />
      <div
        class="flex-auto rounded-md p-3 ring-1 ring-inset neutral-content bdk bdr"
      >
        <div class="flex zt gap-x-4">
          <div class="py-0.5 text-xs text-gray-500">
            <span class="font-medium text-gray-300">Chelsea Hagon</span>
            commented
          </div>
          <time
            datetime="2023-01-23T15:56"
            class="flex-none py-0.5 text-xs text-gray-500"
            >3d ago</time
          >
        </div>
        <p class="text-sm text-gray-500">
          Called client, they reassured me the invoice would be paid by the
          25th.
        </p>
      </div>
    </li>
    <li class="relative flex gap-x-4">
      <div class="-bottom-6 absolute left-0 top-0 flex w-6 justify-center">
        <div class="w-px bg-gray-500"></div>
      </div>
      <div
        class="relative flex w-6 h-6 flex-none items-center justify-center bg-base-100"
      >
        <div
          class="w-2.5 h-2.5 rounded-full bg-base-100 ring-neutral-content ring-1 ring-inset"
        ></div>
      </div>
      <p class="flex-auto py-0.5 text-xs text-gray-500">
        <span class="font-medium text-gray-300">Alex Curren</span> viewed the
        invoice.
      </p>
      <time
        datetime="2023-01-24T09:12"
        class="flex-none py-0.5 text-xs text-gray-500"
        >2d ago</time
      >
    </li>
    <li class="relative flex gap-x-4">
      <div class="oq absolute left-0 top-0 flex w-6 justify-center">
        <div class="w-px bg-gray-500"></div>
      </div>
      <div
        class="relative flex w-6 h-6 flex-none items-center justify-center bg-base-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          data-slot="icon"
          class="w-6 h-6 text-primary"
        >
          <path
            fill-rule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
      <p class="flex-auto py-0.5 text-xs text-gray-500">
        <span class="font-medium text-gray-300">Alex Curren</span> paid the
        invoice.
      </p>
      <time
        datetime="2023-01-24T09:20"
        class="flex-none py-0.5 text-xs text-gray-500"
        >1d ago</time
      >
    </li>
  </ul>
</template>
