<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import VehicleItem from '../vehicles/VehicleItem.vue';
import { onMounted } from 'vue';
const { vehicles, getVehicles } = useVehiclesStore();

onMounted(() => {
  getVehicles();
});
</script>

<template>
  <div class="py-24 sm:py-32">
    <div class="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
      <div class="max-w-xl">
        <h2
          class="text-pretty text-3xl font-semibold tracking-tight dark:text-white text-gray-900 sm:text-4xl"
        >
          Your Vehicles
        </h2>
        <p class="mt-6 text-lg leading-8 dark:text-gray-300 text-gray-600">
          Tralala
        </p>
      </div>
      <ul
        role="list"
        class="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2"
      >
        <li v-for="vehicle in vehicles" :key="vehicle.name">
          <VehicleItem :vehicle="vehicle" />
        </li>
      </ul>
    </div>
  </div>
</template>
