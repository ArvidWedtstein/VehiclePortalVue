<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import ExpenseTab from '@/components/vehicles/expenses/ExpenseTab.vue';
import ServiceTab from '@/components/vehicles/services/ServiceTab.vue';
import { RouterLink } from 'vue-router';
import { onMounted, ref, toRefs } from 'vue';
import VehicleShareModal from '@/components/vehicles/VehicleShareModal.vue';

const props = defineProps({
  id: String,
});

const vehiclesStore = useVehiclesStore();
const { currentVehicle } = toRefs(vehiclesStore);
const { setCurrentVehicle } = vehiclesStore;

const vehicleShareModal = ref();

onMounted(async () => {
  await setCurrentVehicle(parseInt(props.id || ''));
});
</script>

<template>
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

  <div
    v-if="currentVehicle"
    class="relative rounded-lg border overflow-hidden bg-base-300 p-4 gap-2"
  >
    <img
      v-if="currentVehicle.thumbnail"
      :src="currentVehicle.thumbnail"
      class="absolute w-1/3 h-full left-0 top-0 bottom-0 object-cover"
      loading="lazy"
    />
    <div class="absolute top-0 left-0 w-1/3 p-2">
      <div class="card bg-neutral bg-opacity-50 rounded-md text-white">
        <div class="card-body">
          <h2 class="card-title">
            {{ currentVehicle.name }} {{ currentVehicle.make }}
          </h2>
          <p>tralala</p>

          <button
            type="button"
            class="btn btn-sm btn-square btn-secondary btn-outline"
            title="Share"
            @click="vehicleShareModal.modalRef.modalRef.showModal()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="w-3 fill-current"
            >
              <path
                d="M307 34.8c-11.5 5.1-19 16.6-19 29.2l0 64-112 0C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96l96 0 0 64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-3">
      <div class="col-start-2 col-span-2 p-4">
        <div role="tablist" class="tabs tabs-bordered">
          <input
            type="radio"
            name="vehicle_tabs"
            role="tab"
            class="tab"
            aria-label="Expenses"
            :checked="true"
          />
          <div role="tabpanel" class="tab-content p-10">
            <ExpenseTab :id="parseInt(id || '')" />
          </div>

          <input
            type="radio"
            name="vehicle_tabs"
            role="tab"
            class="tab"
            aria-label="Service"
          />
          <div role="tabpanel" class="tab-content p-10">
            <ServiceTab :id="parseInt(id || '')" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
