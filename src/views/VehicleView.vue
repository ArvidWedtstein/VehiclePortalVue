<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { RouterLink, useRoute } from 'vue-router';
import { onMounted, watchEffect } from 'vue';

import { storeToRefs } from 'pinia';
import TabsContainer from '@/components/general/utils/TabsContainer.vue';
import VehicleInfoCard from '@/components/vehicles/VehicleView/VehicleInfoCard.vue';
import ChevronRight from '@/assets/icons/ChevronRight.vue';

const route = useRoute();
const vehicleId = Array.isArray(route.params.vehicle_id)
  ? route.params.vehicle_id[0]
  : route.params.vehicle_id;

const vehiclesStore = useVehiclesStore();

const { currentVehicle } = storeToRefs(vehiclesStore);
const { setCurrentVehicle } = vehiclesStore;

watchEffect(() => {
  if (route.params.vehicle_id !== vehicleId)
    setCurrentVehicle(parseInt(vehicleId));
});

onMounted(async () => {
  await setCurrentVehicle(parseInt(vehicleId));
});
</script>

<template>
  <RouterLink to="/vehicles" class="inline-flex items-center gap-2 mb-2">
    <ChevronRight class="w-3" />
    Back to vehicles
  </RouterLink>

  <div
    class="flex w-full flex-col gap-3 flex-grow max-h-max"
    v-if="currentVehicle"
  >
    <VehicleInfoCard />
    <TabsContainer
      class="flex-grow h-full"
      variant="boxed"
      :tabs="['Expenses', 'Services', 'Files']"
      urlMode
    >
      <RouterView v-slot="{ Component }">
        <KeepAlive max="10">
          <component :is="Component"></component>
        </KeepAlive>
      </RouterView>
    </TabsContainer>
  </div>
</template>
