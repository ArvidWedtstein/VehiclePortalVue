<script setup lang="ts">
import ChangelogListItem from './ChangelogListItem.vue';
</script>

<template>
  <ul role="list" class="-mb-8">
    <slot></slot>
    <ChangelogListItem
      actionBy="Some random user"
      avatar="https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=8&amp;w=256&amp;h=256&amp;q=80"
    >
      <a href="#" class="font-semibold text-base-content">Hilary Mahy</a>
      assigned
      <a href="#" class="font-semibold text-base-content">Kristin Watson</a>
    </ChangelogListItem>
    <ChangelogListItem
      actionBy="Some random user"
      avatar="https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=8&amp;w=256&amp;h=256&amp;q=80"
      type="comment"
    >
      <template #icon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          class="w-5 h-5 text-neutral-content"
        >
          <path
            fill-rule="evenodd"
            d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 0 0 1.28.53l3.58-3.579a.78.78 0 0 1 .527-.224 41.202 41.202 0 0 0 5.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0 0 10 2Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM8 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </template>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc
        ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam
        cursus quis sed purus nam.
      </p>
    </ChangelogListItem>
  </ul>
</template>
