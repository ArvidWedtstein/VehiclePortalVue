<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import LineChart from '@/components/LineChart.vue';
import ExpenseModal from './ExpenseModal.vue';

const props = defineProps({
  id: Number,
});

const { vehicles, expenses } = useVehiclesStore();

const vehicle = vehicles.find(({ id: vehicle_id }) => vehicle_id === props.id);

// const fuelData = computed(() => {
//   const dataPoints = [];

//   for (let i = 1; i < expenses.length; i++) {
//     const current = expenses[i];
//     const previous = expenses[i - 1];

//     // Calculate distance traveled
//     const distance = current.odometer_reading - previous.odometer_reading;

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
</script>

<template>
  <ExpenseModal v-if="props.id" :vehicle_id="props.id" />

  <button class="btn" onclick="expenseModal.showModal()">Add Expense</button>
  <!-- :data="fuelData" -->
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

  <ul class="mt-4 acw acz text-sm ayb daq dqz divide-y divide-base-100">
    <li
      class="relative flex space-x-6 py-6 xl:static"
      v-for="(expense, index) in expenses"
      :key="index"
    >
      <img
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
        alt=""
        class="h-14 w-14 flex-none rounded-full"
      />
      <div class="flex-1">
        <h3 class="capitalize font-semibold azh xl:pr-0">
          {{ expense.expense_type }}
        </h3>
        <dl class="mt-2 flex flex-col azd xl:flex-row">
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
              <time datetime="2022-01-10T17:00"
                >January 10th, 2022 at 5:00 PM</time
              >
            </dd>
          </div>
          <div
            class="mt-2 flex items-start space-x-3 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-secondary dvf xl:pl-3.5"
          >
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
                  d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </dt>
            <dd>Starbucks</dd>
          </div>
        </dl>
      </div>
      <div class="aa dh ea xl:relative dql dqo dut">
        <div>
          <button
            class="fw flex zr rounded-full arv azd bmt"
            id="headlessui-menu-button-:r2:"
            type="button"
            aria-haspopup="menu"
            aria-expanded="false"
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
          </button>
        </div>
      </div>
    </li>
  </ul>
</template>
