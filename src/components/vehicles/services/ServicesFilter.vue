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
    class="btn btn-accent w-auto"
    @click="drawerRef?.open()"
  >
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
