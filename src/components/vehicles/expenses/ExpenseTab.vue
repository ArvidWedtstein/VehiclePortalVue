<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import LineChart from '@/components/LineChart.vue';
import ExpenseModal from './ExpenseModal.vue';
import { onMounted, toRefs } from 'vue';
import { formatDate } from '@/utils/date';

const props = defineProps({
  id: Number,
});

const vehiclesStore = useVehiclesStore();

const { expenses } = toRefs(vehiclesStore);
const { getExpenses } = vehiclesStore;

// const vehicle = vehicles.find(({ id: vehicle_id }) => vehicle_id === props.id);

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
onMounted(() => {
  getExpenses();
});
</script>

<template>
  <ExpenseModal v-if="props.id" :vehicle_id="props.id" />

  <button class="btn" onclick="expenseModal.showModal()">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      class="w-4 fill-current"
    >
      <path
        d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"
      />
    </svg>
    Add Expense
  </button>
  <!-- :data="fuelData" -->
  <!-- <LineChart
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
  /> -->

  <ul class="mt-4 acw acz text-sm ayb daq dqz divide-y divide-base-100">
    <li
      class="relative flex space-x-6 py-6 xl:static"
      v-for="(expense, index) in expenses"
      :key="index"
    >
      <div class="w-14 h-14 flex-none rounded-full border">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          class="h-14 w-14 p-3"
          fill="currentColor"
        >
          <path
            d="M32 64C32 28.7 60.7 0 96 0L256 0c35.3 0 64 28.7 64 64l0 192 8 0c48.6 0 88 39.4 88 88l0 32c0 13.3 10.7 24 24 24s24-10.7 24-24l0-154c-27.6-7.1-48-32.2-48-62l0-64L384 64c-8.8-8.8-8.8-23.2 0-32s23.2-8.8 32 0l77.3 77.3c12 12 18.7 28.3 18.7 45.3l0 13.5 0 24 0 32 0 152c0 39.8-32.2 72-72 72s-72-32.2-72-72l0-32c0-22.1-17.9-40-40-40l-8 0 0 144c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32L32 64zM96 80l0 96c0 8.8 7.2 16 16 16l128 0c8.8 0 16-7.2 16-16l0-96c0-8.8-7.2-16-16-16L112 64c-8.8 0-16 7.2-16 16z"
          />
        </svg>
      </div>

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
              <time :datetime="expense.expense_date">{{
                formatDate(expense.expense_date)
              }}</time>
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
            <dd>{{ expense.notes }}</dd>
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
