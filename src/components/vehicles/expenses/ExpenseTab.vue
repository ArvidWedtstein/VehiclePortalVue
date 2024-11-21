<script setup lang="ts">
import ExpenseModal from './ExpenseModal.vue';
import { onMounted, ref, toRefs } from 'vue';
import { formatDate } from '@/utils/date';
import { useExpensesStore } from '@/stores/expenses';

const expenseStore = useExpensesStore();

const { expenses } = toRefs(expenseStore);
const { getExpenses, deleteExpense } = expenseStore;

const expenseModal = ref();

// const vehicle = vehicles.find(({ id: vehicle_id }) => vehicle_id === props.id);

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

onMounted(() => {
  getExpenses();
});
</script>

<template>
  <ExpenseModal ref="expenseModal" />

  <button class="btn" @click="expenseModal.open()">
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

  <ul class="mt-4 text-sm divide-y divide-base-100">
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
        <h3 class="capitalize font-semibold xl:pr-0">
          {{ expense.expense_type }}
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
              <time :datetime="expense.expense_date">{{
                formatDate(expense.expense_date)
              }}</time>
            </dd>
          </div>
          <div
            class="mt-2 flex items-start space-x-2 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-secondary xl:pl-3.5"
          >
            <dt class="mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                class="h-5 w-5"
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
      <div class="xl:relative">
        <div class="dropdown dropdown-end">
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
            class="dropdown-content menu menu-sm bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li>
              <button type="button" @click="expenseModal.open(expense.id)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  class="h-4 w-4 fill-current"
                >
                  <path
                    d="M192 320C192 337.674 206.326 352 224 352S256 337.674 256 320S241.674 288 224 288S192 302.326 192 320ZM528 327.4C528 327.42 527.99 327.436 527.99 327.455V448C527.99 456.836 520.826 464 511.99 464H64C55.164 464 48 456.836 48 448V192C48 183.162 55.164 176 64 176H286.188L334.18 128H64C28.654 128 0 156.654 0 192V448C0 483.346 28.654 512 64 512H511.988C547.334 512 575.986 483.348 575.988 448.002L575.996 241.826L528 289.818V327.4ZM96 320C96 337.674 110.326 352 128 352S160 337.674 160 320S145.674 288 128 288S96 302.326 96 320ZM640 84.268C640 67.71 633.551 52.141 621.842 40.432L599.568 18.158C587.859 6.449 572.289 0 555.729 0S523.6 6.449 511.889 18.16L315.49 214.566C309.469 220.59 305.404 228.186 303.732 236.535L288.656 311.924C288.216 314.127 288 316.343 288 318.542C288 336.263 302.316 352 321.469 352C323.633 352 325.838 351.791 328.072 351.344L403.463 336.266C411.814 334.596 419.414 330.527 425.436 324.502L621.838 128.117C635.765 114.19 640 97.405 640 84.268ZM587.898 94.174L392.561 289.496L339.99 300.01L350.504 247.436L545.83 52.102C548.551 49.379 551.881 48 555.729 48S562.908 49.379 565.627 52.1L587.9 74.373C590.621 77.092 592 80.424 592 84.27C592 88.121 590.619 91.453 587.898 94.174Z "
                  ></path>
                </svg>
                Edit
              </button>
            </li>
            <li>
              <button type="button" @click="deleteExpense(expense.id)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  class="h-4 w-4 fill-current"
                >
                  <path
                    d="M432 80H349.625L315.625 23.25C306.984 8.827 291.405 0 274.592 0H173.408C156.595 0 141.016 8.827 132.375 23.25L98.375 80H16C7.125 80 0 87.125 0 96V112C0 120.875 7.125 128 16 128H32V448C32 483.346 60.654 512 96 512H352C387.346 512 416 483.346 416 448V128H432C440.875 128 448 120.875 448 112V96C448 87.125 440.875 80 432 80ZM171.875 50.875C172.875 49.125 174.875 48 177 48H271C273.125 48 275.125 49.125 276.125 50.875L293.625 80H154.375L171.875 50.875ZM352 464H96C87.163 464 80 456.837 80 448V128H368V448C368 456.837 360.837 464 352 464ZM224 416C232.844 416 240 408.844 240 400V192C240 183.156 232.844 176 224 176S208 183.156 208 192V400C208 408.844 215.156 416 224 416ZM144 416C152.844 416 160 408.844 160 400V192C160 183.156 152.844 176 144 176S128 183.156 128 192V400C128 408.844 135.156 416 144 416ZM304 416C312.844 416 320 408.844 320 400V192C320 183.156 312.844 176 304 176S288 183.156 288 192V400C288 408.844 295.156 416 304 416Z"
                  />
                </svg>
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
    </li>
  </ul>
</template>
