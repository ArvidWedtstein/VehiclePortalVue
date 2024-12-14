<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { RouterLink, useRoute } from 'vue-router';
import { computed, defineAsyncComponent, onBeforeMount, ref, watch } from 'vue';

import { storeToRefs } from 'pinia';
import { useServicesStore } from '@/stores/services';
import { formatDate } from '@/utils/date';
import { formatNumber } from '@/utils/format';

const ServiceModal = defineAsyncComponent(
  async () => await import('@/components/vehicles/services/ServiceModal.vue'),
);

const vehiclesStore = useVehiclesStore();
const servicesStore = useServicesStore();

const { currentVehicle } = storeToRefs(vehiclesStore);

const { services, loading } = storeToRefs(servicesStore);
const { getServices } = servicesStore;

const serviceModalRef = ref();

const route = useRoute();

const serviceId = Array.isArray(route.params.id)
  ? parseInt(route.params.id[0])
  : parseInt(route.params.id);

const service = computed(() => {
  const serviceId = Array.isArray(route.params.id)
    ? parseInt(route.params.id[0])
    : parseInt(route.params.id);

  return services.value.filter(({ id }) => id === serviceId)[0];
});

watch(
  () => route.params.id,
  () => getServices({ id: serviceId }),
  {
    immediate: true,
  },
);

onBeforeMount(async () => {
  await getServices({ id: serviceId });
});
</script>

<template>
  <ServiceModal ref="serviceModalRef" />

  <RouterLink
    v-if="currentVehicle"
    :to="{ name: 'services' }"
    class="flex gap-2 mb-2"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      class="w-3 fill-current"
    >
      <path
        d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"
      />
    </svg>
    Back to services
  </RouterLink>

  <div v-if="!loading" class="card card-side bg-base-100 shadow-xl">
    <div class="card-body">
      <div class="flex justify-between w-full">
        <h2 class="card-title">{{ service.type }}</h2>

        <button
          type="button"
          class="btn btn-sm btn-outline btn-neutral"
          @click="serviceModalRef.open(service.id)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="w-3 fill-current"
          >
            <path
              d="M455.703 18.748C443.209 6.252 426.829 0 410.452 0C394.07 0 377.695 6.25 365.196 18.75L45.11 338.885C36.542 347.451 30.584 358.275 27.926 370.094L0.319 492.854C-1.701 502.967 6.158 512 15.946 512C16.993 512 18.061 511.896 19.143 511.68C19.143 511.68 103.751 493.73 141.894 484.748C153.432 482.031 163.759 476.225 172.139 467.844C221.264 418.719 406.649 233.33 493.302 146.676C518.294 121.684 518.202 81.256 493.212 56.262L455.703 18.748ZM138.201 433.902C136.086 436.018 133.697 437.365 130.893 438.025C112.719 442.307 83.432 448.738 58.204 454.203L74.751 380.627C75.417 377.668 76.902 374.973 79.048 372.824L320.936 130.902L381.064 191.035L138.201 433.902Z"
            />
          </svg>
          Edit
        </button>
      </div>

      <ul class="flex flex-col gap-1 text-sm">
        <li class="inline-flex gap-1 items-center">
          <span class="font-semibold">Date:</span>
          <span>
            {{ formatDate(service.date) }}
          </span>
        </li>
        <li class="inline-flex gap-1 items-center">
          <span class="font-semibold">Provider:</span>
          <span>
            {{ service.provider }}
          </span>
        </li>
        <li class="inline-flex gap-1 items-center">
          <span class="font-semibold">Mileage:</span>
          <span>
            {{
              formatNumber(service.mileage || 0, {
                style: 'unit',
                unit: currentVehicle?.mileage_unit || 'kilometer',
                compactDisplay: 'short',
              })
            }}
          </span>
        </li>
        <li class="inline-flex gap-1 items-center">
          <span class="font-semibold">Cost:</span>
          <span>
            {{
              formatNumber(service.cost || 0, {
                style: 'currency',
                currency: service.currency || 'EUR',
                currencyDisplay: 'narrowSymbol',
                compactDisplay: 'short',
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
              })
            }}
          </span>
        </li>
      </ul>

      <div class="divider my-0"></div>

      <p class="capitalize text-sm">{{ service.notes }}</p>
    </div>
  </div>
</template>
