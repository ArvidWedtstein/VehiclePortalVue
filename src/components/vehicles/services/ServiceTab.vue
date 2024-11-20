<script setup lang="ts">
import LineChart from '@/components/LineChart.vue';
import ServiceModal from './ServiceModal.vue';
import { useServicesStore } from '@/stores/services';
import { onMounted, ref, toRef } from 'vue';
import { formatDate } from '@/utils/date';

const servicesStore = useServicesStore();

const services = toRef(servicesStore, 'services');
const { getServices } = servicesStore;

const serviceModal = ref();
// const fuelData = computed(() => {
//   const dataPoints = [];

//   for (let i = 1; i < expenses.length; i++) {
//     const current = expenses[i];
//     const previous = expenses[i - 1];

//     // Calculate distance traveled
//     const distance = current.mileage - previous.mileage;

//     // Calculate fuel economy in liters per 100 km
//     const fuelUsed = current.amount; // In liters
//     const fuelEconomy = (fuelUsed / distance) * 100; // L/100km

//     dataPoints.push({
//       month: new Date(current.expense_date).getMonth(),
//       fuelEconomy: Math.round(fuelEconomy * 100) / 100,
//     });
//   }

//   console.log(Object.values(groupBy(dataPoints, 'month')));

//   return [0]; // Object.values(groupBy(dataPoints, 'month')).map(p => p[0].fuelEconomy);
// });

const editService = (service_id: number) => {
  serviceModal.value.open(service_id);
};

onMounted(() => {
  getServices();
});
</script>

<template>
  <ServiceModal ref="serviceModal" />

  <button class="btn" @click="serviceModal.open()">Add Service</button>
  <LineChart
    :data="[10, 25, 40, 30, 50, 35, 70, 40, 20, 50, 80, 30]"
    :width="400"
    :height="400"
    :xLabels="[
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]"
    :yTicks="[0, 20, 40, 60, 80, 100]"
    animate
  />
  <ul class="mt-4 text-sm divide-y divide-base-100">
    <li
      class="relative flex space-x-6 py-6 xl:static"
      v-for="(service, index) in services"
      :key="index"
    >
      <div class="w-14 h-14 flex-none rounded-full border">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          class="h-14 w-14 p-3 fill-current"
        >
          <path
            d="M320 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0 0 32-80 0-48 0-48 0c-26.5 0-48 21.5-48 48l0 64.8c0 19 11.2 36.2 28.5 43.9l67.5 30L96 368c0 26.5 21.5 48 48 48l259.1 0c18.4 0 35.8-7.9 48-21.7L633.5 187.7c12.3-13.9-.3-35.4-18.4-31.5L448 192l-50.5-25.2c-8.9-4.4-18.7-6.8-28.6-6.8L288 160l0-32 32 0zM96 208l0 86.1L48 272.8 48 208l48 0z"
          />
        </svg>
      </div>

      <div class="flex-1">
        <h3 class="capitalize font-semibold xl:pr-0">
          {{ service.type }}
        </h3>
        <dl class="mt-2 flex flex-col xl:flex-row">
          <div class="flex items-start flex-nowrap space-x-3">
            <dt class="mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
                class="h-5 w-5 azb"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </dt>
            <dd>
              <time
                v-if="service.service_date"
                :datetime="service.service_date"
                >{{ formatDate(service.service_date) }}</time
              >
            </dd>
          </div>
          <div
            class="mt-2 flex items-start space-x-3 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-secondary xl:pl-3.5"
          >
            <dd>{{ service.notes }}</dd>
          </div>
        </dl>
      </div>
      <div class="xl:relative">
        <div class="dropdown">
          <div
            tabindex="0"
            role="button"
            class="btn btn-sm btn-ghost btn-circle flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              data-slot="icon"
              class="h-5 w-5"
            >
              <path
                d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
              ></path>
            </svg>
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li>
              <button type="button" @click="editService(service.id)">
                Edit
              </button>
            </li>
            <li><button>Delete</button></li>
          </ul>
        </div>
      </div>
    </li>
  </ul>
</template>
