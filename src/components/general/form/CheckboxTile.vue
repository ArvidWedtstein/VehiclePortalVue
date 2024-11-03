<script setup lang="ts"></script>

<template>
  <label
    class="relative flex cursor-pointer rounded-lg border border-opacity-20 border-base-content p-4 aspect-square"
    role="radio"
    tabindex="0"
    for="checkboxTile"
  >
    <input
      id="checkboxTile"
      type="checkbox"
      aria-hidden="true"
      v-bind="$attrs"
      class="appearance-none outline-none peer transition absolute -inset-px rounded-lg border-2 border-transparent hover:border-primary hover:border-opacity-30 checked:border-primary hover:checked:border-opacity-100"
    />
    <span
      class="flex flex-1 flex-col text-center items-center justify-end select-none"
    >
      <slot> Click me </slot>
    </span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      data-slot="icon"
      class="absolute right-4 transition-opacity h-5 w-5 text-primary peer-hover:opacity-30 opacity-0 peer-checked:!opacity-100"
    >
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
        clip-rule="evenodd"
      ></path>
    </svg>
  </label>
</template>
