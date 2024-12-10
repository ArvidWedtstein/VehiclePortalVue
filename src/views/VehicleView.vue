<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import ExpenseTab from '@/components/vehicles/expenses/ExpenseTab.vue';
import ServiceTab from '@/components/vehicles/services/ServiceTab.vue';
import { RouterLink, useRoute } from 'vue-router';
import { onMounted, ref, watchEffect } from 'vue';
import VehicleShareModal from '@/components/vehicles/ShareVehicleModal.vue';
import FilesTab from '@/components/vehicles/files/FilesTab.vue';

import { storeToRefs } from 'pinia';
import ChangelogTab from '@/components/vehicles/changelog/ChangelogTab.vue';
import VehicleModal from '@/components/vehicles/VehicleModal/VehicleModal.vue';
import TabsContainer from '@/components/general/utils/TabsContainer.vue';
import VehicleInfoCard from '@/components/vehicles/VehicleView/VehicleInfoCard.vue';

const route = useRoute();
const vehicleId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

const vehiclesStore = useVehiclesStore();

const { currentVehicle } = storeToRefs(vehiclesStore);
const { setCurrentVehicle } = vehiclesStore;

const vehicleModal = ref();
const vehicleShareModal = ref();

watchEffect(() => {
  if (route.params.id !== vehicleId) setCurrentVehicle(parseInt(vehicleId));
});

onMounted(async () => {
  await setCurrentVehicle(parseInt(vehicleId));
});
</script>

<template>
  <VehicleModal ref="vehicleModal" />
  <VehicleShareModal ref="vehicleShareModal" />

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

  <div class="flex w-full flex-col lg:flex-row" v-if="currentVehicle">
    <VehicleInfoCard
      @edit="vehicleModal.open"
      @share="vehicleShareModal.open"
    />
    <div class="divider lg:divider-horizontal"></div>
    <div class="card grow">
      <TabsContainer
        variant="boxed"
        :tabs="['Expenses', 'Services', 'Files', 'Changelog']"
      >
        <template #expenses>
          <ExpenseTab />
        </template>

        <template #services>
          <ServiceTab />
        </template>

        <template #files>
          <FilesTab />
        </template>

        <template #changelog>
          <ChangelogTab />
        </template>
      </TabsContainer>
    </div>
  </div>
</template>
