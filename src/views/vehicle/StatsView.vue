<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useExpensesStore } from '@/stores/expenses';
import { groupBy } from '@/utils/utils';
import { sum } from '@/utils/math';
import ServicesChart from '@/components/vehicles/services/ServicesChart.vue';
import ExpensesChart from '@/components/vehicles/expenses/ExpensesChart.vue';

const expensesStore = useExpensesStore();

const { expenses, loading } = storeToRefs(expensesStore);

const statFuelCostPerMonth = computed(() => {
  const currentMonth = `${new Date().getFullYear()}-${new Date().getMonth()}`;
  const prevMonth =
    new Date().getMonth() - 1 < 0
      ? `${new Date().getFullYear() - 1}-11`
      : `${new Date().getFullYear()}-${new Date().getMonth() - 1}`;

  const monthExpenses = expenses.value.map(expense => {
    const expenseDate = new Date(expense.date);

    return {
      ...expense,
      monthYear: `${expenseDate.getFullYear()}-${expenseDate.getMonth()}`,
    };
  });

  const groupedExpensesPerMonth = groupBy(monthExpenses, 'monthYear');

  const costPrevMonth =
    sum(groupedExpensesPerMonth[prevMonth] || [], 'cost') || 0;
  const costThisMonth = sum(groupedExpensesPerMonth[currentMonth], 'cost') || 0;

  const percentageDiffToPrevMonth =
    ((costThisMonth - costPrevMonth) / costPrevMonth) * 100;
  return {
    costPrevMonth,
    costThisMonth,
    percentageDiffToPrevMonth: isNaN(percentageDiffToPrevMonth)
      ? 0
      : percentageDiffToPrevMonth,
  };
});
</script>

<template>
  <div class="stats shadow-lg">
    <div class="stat" v-if="!loading">
      <div class="stat-figure text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          class="inline-block h-8 w-8 fill-current"
        >
          <path
            fill-rule="evenodd"
            d="M32 64C32 28.7 60.7 0 96 0L256 0c35.3 0 64 28.7 64 64l0 192 8 0c48.6 0 88 39.4 88 88l0 32c0 13.3 10.7 24 24 24s24-10.7 24-24l0-154c-27.6-7.1-48-32.2-48-62l0-64L384 64c-8.8-8.8-8.8-23.2 0-32s23.2-8.8 32 0l77.3 77.3c12 12 18.7 28.3 18.7 45.3l0 13.5 0 24 0 32 0 152c0 39.8-32.2 72-72 72s-72-32.2-72-72l0-32c0-22.1-17.9-40-40-40l-8 0 0 144c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32L32 64zM96 80l0 96c0 8.8 7.2 16 16 16l128 0c8.8 0 16-7.2 16-16l0-96c0-8.8-7.2-16-16-16L112 64c-8.8 0-16 7.2-16 16z"
          />
        </svg>
      </div>
      <div class="stat-title">Spent on Fuel this Month</div>
      <div class="stat-value text-primary">
        {{ statFuelCostPerMonth.costThisMonth }}
      </div>
      <div class="stat-desc">
        {{ Math.abs(statFuelCostPerMonth.percentageDiffToPrevMonth) }}%
        {{
          statFuelCostPerMonth.percentageDiffToPrevMonth < 0 ? 'less' : 'more'
        }}
        than last month
      </div>
    </div>
  </div>

  <div class="stats shadow-lg">
    <div class="stat">
      <div class="stat-title">Expenses</div>
      <div class="stat-value">
        <ExpensesChart />
      </div>
    </div>

    <div class="stat">
      <div class="stat-title">Services</div>
      <div class="stat-value">
        <ServicesChart />
      </div>
    </div>
  </div>
</template>
