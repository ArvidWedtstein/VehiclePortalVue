<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { RouterLink, useRoute } from 'vue-router';
import { computed, onBeforeMount, watch } from 'vue';

import { storeToRefs } from 'pinia';
import { useExpensesStore } from '@/stores/expenses';
import { formatDate } from '@/utils/date';
import { formatNumber } from '@/utils/format';
import { useConfirm } from '@/lib/hooks/useConfirm';

const vehiclesStore = useVehiclesStore();
const expensesStore = useExpensesStore();

const { currentVehicle } = storeToRefs(vehiclesStore);
const { expenses, loading } = storeToRefs(expensesStore);
const { getExpenses, deleteExpense } = expensesStore;

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

const handleExpenseDelete = async () => {
  const res = await useConfirm({
    title: 'Delete Expense?',
    message:
      'Are you sure you want to delete this expense? This cannot be undone.',
    confirmLabel: 'Delete',
    severity: 'danger',
  });

  if (!res) return;

  deleteExpense(expense.value.id);
};

watch(
  () => route.params.id,
  () => getExpenses({ id: expenseId }),
  {
    immediate: true,
  },
);

onBeforeMount(() => {
  getExpenses({ id: expenseId });
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

      <p class="capitalize text-sm mb-2">{{ expense.notes }}</p>

      <div class="card-actions justify-between">
        <button type="button" class="btn btn-sm">
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

        <button
          type="button"
          class="btn btn-sm btn-outline btn-error"
          @click="handleExpenseDelete"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            class="w-3 fill-current"
          >
            <path
              d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
            />
          </svg>
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
