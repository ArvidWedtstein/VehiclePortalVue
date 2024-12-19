<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { RouterLink, useRoute } from 'vue-router';
import { defineAsyncComponent, onMounted, ref, watchEffect } from 'vue';

import { storeToRefs } from 'pinia';
import TabsContainer from '@/components/general/utils/TabsContainer.vue';
import VehicleInfoCard from '@/components/vehicles/VehicleView/VehicleInfoCard.vue';

const VehicleModal = defineAsyncComponent(
  async () =>
    await import('@/components/vehicles/VehicleModal/VehicleModal.vue'),
);

const route = useRoute();
const vehicleId = Array.isArray(route.params.vehicle_id)
  ? route.params.vehicle_id[0]
  : route.params.vehicle_id;

const vehiclesStore = useVehiclesStore();

const { currentVehicle } = storeToRefs(vehiclesStore);
const { setCurrentVehicle } = vehiclesStore;

const vehicleModal = ref();

watchEffect(() => {
  if (route.params.vehicle_id !== vehicleId)
    setCurrentVehicle(parseInt(vehicleId));
});

onMounted(async () => {
  await setCurrentVehicle(parseInt(vehicleId));
});
</script>

<template>
  <VehicleModal ref="vehicleModal" />

  <RouterLink to="/vehicles" class="flex gap-2 mb-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      class="w-3 fill-current"
    >
      <path
        d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"
      />
    </svg>
    Back to vehicles
  </RouterLink>

  <div class="flex w-full flex-col gap-3" v-if="currentVehicle">
    <VehicleInfoCard @edit="vehicleModal?.open" />
    <div class="card grow">
      <TabsContainer
        variant="boxed"
        :tabs="['Expenses', 'Services', 'Files', 'Changelog']"
        urlMode
      >
        <RouterView v-slot="{ Component }">
          <KeepAlive max="10">
            <component :is="Component"></component>
          </KeepAlive>
        </RouterView>
      </TabsContainer>
    </div>
  </div>
</template>
