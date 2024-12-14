<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { RouterLink, useRoute } from 'vue-router';
import { computed, onBeforeMount, watch } from 'vue';

import { storeToRefs } from 'pinia';
import { useExpensesStore } from '@/stores/expenses';
import { formatDate } from '@/utils/date';
import { formatNumber } from '@/utils/format';

const vehiclesStore = useVehiclesStore();
const expensesStore = useExpensesStore();

const { currentVehicle } = storeToRefs(vehiclesStore);
const { expenses, loading } = storeToRefs(expensesStore);
const { getExpenses } = expensesStore;

const route = useRoute();

const expenseId = Array.isArray(route.params.id)
  ? parseInt(route.params.id[0])
  : parseInt(route.params.id);

const expense = computed(() => {
  const expenseId = Array.isArray(route.params.id)
    ? parseInt(route.params.id[0])
    : parseInt(route.params.id);

  return expenses.value.filter(({ id }) => id === expenseId)[0];
});

watch(
  () => route.params.id,
  () => getExpenses({ id: expenseId }),
  {
    immediate: true,
  },
);

onBeforeMount(async () => {
  await getExpenses({ id: expenseId });
});
</script>

<template>
  <RouterLink
    v-if="currentVehicle"
    :to="{ name: 'expenses' }"
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
    Back to expenses
  </RouterLink>

  <!-- TODO: add edit here -->

  <div v-if="!loading" class="card bg-base-100 w-96 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">{{ expense.type }}</h2>

      <ul class="flex flex-col gap-1 text-sm">
        <li class="inline-flex gap-1 items-center">
          <span class="font-semibold">Date:</span>
          <span>
            {{ formatDate(expense.date) }}
          </span>
        </li>
        <li class="inline-flex gap-1 items-center">
          <span class="font-semibold">Mileage:</span>
          <span>
            {{
              formatNumber(expense.mileage || 0, {
                style: 'unit',
                unit: currentVehicle?.mileage_unit || 'kilometer',
                compactDisplay: 'short',
              })
            }}
          </span>
        </li>
        <li class="inline-flex gap-1 items-center">
          <span class="font-semibold">Amount:</span>
          <span>
            {{
              formatNumber(expense.amount || 0, {
                style: 'unit',
                unit: expense.unit || 'liter',
                unitDisplay: 'long',
                compactDisplay: 'short',
              })
            }}
          </span>
        </li>
        <li class="inline-flex gap-1 items-center">
          <span class="font-semibold">Cost:</span>
          <span>
            {{
              formatNumber(expense.cost || 0, {
                style: 'currency',
                currency: expense.currency || 'EUR',
                currencyDisplay: 'narrowSymbol',
                compactDisplay: 'short',
              })
            }}
          </span>
        </li>
        <li class="inline-flex gap-1 items-center">
          <span class="font-semibold">Filled for:</span>
          <span>
            {{
              formatNumber(expense.price_per_unit || 0, {
                style: 'currency',
                currency: expense.currency || 'EUR',
                currencyDisplay: 'narrowSymbol',
                maximumFractionDigits: 2,
              })
            }}
            per
            {{ expense.unit || 'liter' }}
          </span>
        </li>
      </ul>

      <div class="divider my-0"></div>

      <p class="capitalize text-sm">{{ expense.notes }}</p>
    </div>
  </div>
</template>
