<script setup lang="ts">
import type { FilterOption } from '@/components/general/filter/FilterMenu.vue';
import FilterMenu from '@/components/general/filter/FilterMenu.vue';
import MobileDrawer from '@/components/general/modal/MobileDrawer.vue';
import { ref } from 'vue';

const drawerRef = ref<InstanceType<typeof MobileDrawer>>();
const filterMenuRef = ref<InstanceType<typeof FilterMenu>>();

const filterOptions: Array<FilterOption> = [
  {
    title: 'Fuel',
    type: 'checkbox',
    subOptions: ['Gasoline', 'Diesel', 'LPG'],
  },
  { title: 'Created by me', type: 'boolean' },
  {
    title: 'Currency',
    type: 'checkbox',
    subOptions: ['NOK', 'EUR', 'GBP', 'USD', 'SEK', 'DDK'],
  },
  { title: 'Date', type: 'from-to-date' },
] as const;

const emit = defineEmits<{
  reset: [];
  apply: [filters: Array<FilterOption>];
}>();

const handleFilterApply = () => {
  if (!filterMenuRef.value) return;

  emit('apply', JSON.parse(JSON.stringify(filterMenuRef.value.filterOptions)));
};
</script>

<template>
  <button
    type="button"
    class="btn btn-outline w-auto join-item"
    @click="drawerRef?.open()"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      class="fill-current size-4"
    >
      <path
        d="M507.71 58.707C500.023 42.232 483.786 32 465.337 32H46.654C28.204 32 11.968 42.232 4.283 58.707C-3.196 74.734 -0.758 93.158 10.644 106.787L175.995 309.912V377.619C175.995 390.166 182.173 401.922 192.519 409.066L274.835 472.617C281.997 477.613 289.578 480 297.408 480C318.685 480 335.995 462.807 335.995 441.67V309.912L501.486 106.623C512.749 93.158 515.187 74.734 507.71 58.707ZM295.187 283.986C290.535 289.699 287.995 296.844 287.995 304.215V422.113L223.995 372.725V304.215C223.995 296.844 221.456 289.699 216.804 283.986L50.773 80.037H461.214L295.187 283.986Z"
      />
    </svg>
    Filter
  </button>

  <MobileDrawer ref="drawerRef" direction="bottom" drawerClass="h-1/2">
    <FilterMenu
      ref="filterMenuRef"
      class="px-4 py-2"
      :options="filterOptions"
      @resetFilters="emit('reset')"
    >
    </FilterMenu>

    <template #actions>
      <button
        type="button"
        class="btn btn-primary btn-block"
        @click="handleFilterApply"
      >
        Apply
      </button>
    </template>
  </MobileDrawer>
</template>
