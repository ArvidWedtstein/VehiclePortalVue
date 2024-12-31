<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { RouterLink, useRoute } from 'vue-router';
import { computed, onMounted, watchEffect } from 'vue';

import TabsContainer from '@/components/general/utils/TabsContainer.vue';
import VehicleInfoCard from '@/components/vehicles/VehicleView/VehicleInfoCard.vue';
import ChevronRight from '@/assets/icons/ChevronRight.vue';

const route = useRoute();
const vehicleId = computed(() =>
  Array.isArray(route.params.vehicle_id)
    ? route.params.vehicle_id[0]
    : route.params.vehicle_id,
);

const vehiclesStore = useVehiclesStore();

const { setCurrentVehicle } = vehiclesStore;

watchEffect(() => {
  if (route.params.vehicle_id !== vehicleId.value)
    setCurrentVehicle(parseInt(vehicleId.value));
});

onMounted(async () => {
  await setCurrentVehicle(parseInt(vehicleId.value));
});
</script>

<template>
  <RouterLink to="/vehicles" class="flex items-center gap-2 mb-2">
    <ChevronRight class="w-3" />
    Back to vehicles
  </RouterLink>

  <div class="flex flex-col gap-3 flex-1 w-full">
    <VehicleInfoCard />

    <TabsContainer
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
