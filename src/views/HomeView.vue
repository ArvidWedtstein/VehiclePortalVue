<script setup lang="ts">
import FilterMenu from '@/components/general/filter/FilterMenu.vue';
</script>

<template>
  <main>
    <h1>Home</h1>

    <!-- Testing in progress. plz ignore -->
    <FilterMenu
      :options="[
        {
          title: 'Fuel',
          type: 'checkbox',
          subOptions: ['Gasoline', 'Diesel', 'LPG'],
        },
        { title: 'By me' },
      ]"
    >
      <!-- <template #fuel> fuel options here </template> -->
    </FilterMenu>
  </main>
</template>
