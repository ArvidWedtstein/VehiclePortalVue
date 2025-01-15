<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { defineAsyncComponent, onMounted, toRef, ref } from 'vue';
import ListGroup from '../general/list/ListGroup.vue';
import ListGroupItem from '../general/list/ListGroupItem.vue';
import AvatarImage from '../general/utils/AvatarImage.vue';
import CarIcon from '@/assets/icons/CarIcon.vue';
import MotorcycleIcon from '@/assets/icons/MotorcycleIcon.vue';

const VehicleModal = defineAsyncComponent(
  async () =>
    await import('@/components/vehicles/VehicleModal/VehicleModal.vue'),
);

const vehiclesStore = useVehiclesStore();
const vehicles = toRef(vehiclesStore, 'vehicles');

const { getVehicles } = vehiclesStore;

onMounted(async () => {
  await getVehicles();
});

const vehicleModal = ref();
</script>

<template>
  <VehicleModal ref="vehicleModal" />

  <div class="py-6 mb-12 md:mb-0 md:py-32">
    <div class="mx-auto grid max-w-7xl px-6 gap-6 md:gap-16 xl:grid-cols-3">
      <div class="max-w-xl">
        <h2 class="text-pretty text-3xl font-semibold tracking-tight dark:text-white text-gray-900 sm:text-4xl">
          Your Vehicles
        </h2>
        <p class="mt-6 text-lg leading-8 dark:text-gray-300 text-gray-600">
          Vehicles owned or shared with you
        </p>
      </div>

      <div class="flex flex-col gap-3">
        <ListGroup>
          <ListGroupItem :title="'Create New Vehicle'" class="border border-primary !rounded-lg"
            @click="vehicleModal.open()">
            <template #icon="{ sizeClass }">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="fill-current p-2" :class="sizeClass">
                <path
                  d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
              </svg>
            </template>
          </ListGroupItem>
        </ListGroup>

        <ListGroup divider>
          <ListGroupItem v-for="(vehicle) in vehicles" :key="vehicle.id" :title="vehicle.make" as="RouterLink"
            :to="{ name: 'vehicle', params: { vehicle_id: vehicle.id } }">
            <template #icon>
              <AvatarImage v-if="vehicle.thumbnail"
                :src="`https://akhxphgocxpyoofvdqwi.supabase.co/storage/v1/object/public/${vehicle.thumbnail}`" />

              <div v-else class="flex justify-center items-center w-12 text-base-content p-2">
                <CarIcon v-if="vehicle.type === 'Car'" class="h-8" />

                <MotorcycleIcon v-if="vehicle.type === 'Motorcycle'" class="w-7" />
              </div>
            </template>

            <template #endIcon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="w-3 fill-current">
                <path
                  d="M113.333 47.409L297.314 239.407C301.783 244.032 304.001 250.032 304.001 256.001S301.783 267.969 297.314 272.594L113.333 464.592C104.181 474.186 88.994 474.499 79.431 465.311C69.806 456.186 69.494 440.936 78.712 431.405L246.759 256.001L78.712 80.596C69.494 71.096 69.806 55.815 79.431 46.69C88.994 37.503 104.181 37.815 113.333 47.409Z" />
              </svg>
            </template>
          </ListGroupItem>
        </ListGroup>
      </div>
    </div>
  </div>
</template>
