<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { defineAsyncComponent, onMounted, toRefs, ref } from 'vue';
import VehicleGridItem from './VehicleGridItem.vue';

const VehicleModal = defineAsyncComponent(
  async () =>
    await import('@/components/vehicles/VehicleModal/VehicleModal.vue'),
);

const vehiclesStore = useVehiclesStore();

const { vehicles } = toRefs(vehiclesStore);
const { getVehicles } = vehiclesStore;

onMounted(() => {
  getVehicles();
});

const editVehicle_ID = ref<number | undefined>(undefined);

const vehicleModal = ref();

const editVehicle = (vehicle_id: number) => {
  editVehicle_ID.value = vehicle_id;

  vehicleModal.value.open(vehicle_id);
};
</script>

<template>
  <VehicleModal ref="vehicleModal" :vehicle_id="editVehicle_ID" />

  <div class="py-24 sm:py-32">
    <div class="mx-auto grid max-w-7xl gap-20 px-6 lg:gap-8 xl:grid-cols-3">
      <div class="max-w-xl">
        <h2
          class="text-pretty text-3xl font-semibold tracking-tight dark:text-white text-gray-900 sm:text-4xl"
        >
          Your Vehicles
        </h2>
        <p class="mt-6 text-lg leading-8 dark:text-gray-300 text-gray-600">
          Vehicles owned or shared by you
        </p>
      </div>
      <ul role="list" class="grid gap-8 sm:grid-cols-2 sm:gap-16 xl:col-span-2">
        <li v-for="(vehicle, index) in vehicles" :key="index">
          <VehicleGridItem :vehicle="vehicle" @editVehicle="editVehicle" />
        </li>

        <li>
          <button
            type="button"
            class="relative block w-full h-full rounded-lg border-2 border-dashed p-12 text-center focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-primary focus:ring-2 focus:outline-none hover:border-secondary transition-colors"
            onclick="vehicleModal.showModal()"
          >
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
              aria-hidden="true"
              class="mx-auto w-12 h-12 text-neutral-content"
            >
              <path
                d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            <span class="mt-2 block text-sm font-semibold text-base-content"
              >Add Vehicle</span
            >
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
