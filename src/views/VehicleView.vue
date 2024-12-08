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
  console.log(route.params, vehicleId);

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

  <div v-if="currentVehicle" class="relative">
    <img
      v-if="currentVehicle.thumbnail"
      :src="currentVehicle.thumbnail"
      class="absolute w-1/3 h-full left-0 top-0 bottom-0 object-coverhidden md:block"
      loading="lazy"
    />
    <div class="relative md:absolute top-0 left-0 md:w-1/3 w-full p-2">
      <div class="card bg-base-200 text-neutral-content rounded-md h-full">
        <div class="card-body">
          <div class="flex justify-between items-center gap-1">
            <h2 class="card-title">
              {{ currentVehicle.make }} {{ currentVehicle.model }}
            </h2>

            <div class="flex justify-end gap-1">
              <button
                type="button"
                class="btn btn-sm btn-neutral btn-outline"
                title="Share"
                @click="vehicleModal.open(currentVehicle.id)"
              >
                Edit
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  class="w-3 fill-current"
                >
                  <path
                    d="M455.703 18.748C443.209 6.252 426.829 0 410.452 0C394.07 0 377.695 6.25 365.196 18.75L45.11 338.885C36.542 347.451 30.584 358.275 27.926 370.094L0.319 492.854C-1.701 502.967 6.158 512 15.946 512C16.993 512 18.061 511.896 19.143 511.68C19.143 511.68 103.751 493.73 141.894 484.748C153.432 482.031 163.759 476.225 172.139 467.844C221.264 418.719 406.649 233.33 493.302 146.676C518.294 121.684 518.202 81.256 493.212 56.262L455.703 18.748ZM138.201 433.902C136.086 436.018 133.697 437.365 130.893 438.025C112.719 442.307 83.432 448.738 58.204 454.203L74.751 380.627C75.417 377.668 76.902 374.973 79.048 372.824L320.936 130.902L381.064 191.035L138.201 433.902Z"
                  />
                </svg>
              </button>
              <button
                type="button"
                class="btn btn-sm btn-secondary btn-outline"
                title="Share"
                @click="vehicleShareModal.modalRef.modalRef.showModal()"
              >
                Share
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

          <p>tralala</p>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-3">
      <div class="col-start-1 md:col-start-2 col-span-3 md:col-span-2 p-2">
        <div role="tablist" class="tabs tabs-lifted">
          <input
            type="radio"
            name="vehicle_tabs"
            role="tab"
            class="tab"
            aria-label="Expenses"
            :checked="true"
          />
          <div
            role="tabpanel"
            class="tab-content p-4 bg-base-100 border-base-300 rounded-box"
          >
            <ExpenseTab />
          </div>

          <input
            type="radio"
            name="vehicle_tabs"
            role="tab"
            class="tab"
            aria-label="Services"
          />
          <div
            role="tabpanel"
            class="tab-content p-4 bg-base-100 border-base-300 rounded-box"
          >
            <ServiceTab />
          </div>

          <input
            type="radio"
            name="vehicle_tabs"
            role="tab"
            class="tab"
            aria-label="Files"
          />
          <div
            role="tabpanel"
            class="tab-content p-4 bg-base-100 border-base-300 rounded-box"
          >
            <FilesTab />
          </div>

          <input
            type="radio"
            name="vehicle_tabs"
            role="tab"
            class="tab"
            aria-label="Changelog"
          />
          <div
            role="tabpanel"
            class="tab-content p-4 bg-base-100 border-base-300 rounded-box"
          >
            <ChangelogTab />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
