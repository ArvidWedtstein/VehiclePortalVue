<script setup lang="ts">
import { adjustCalendarDate, getRangeBetweenDates } from '@/utils/date';
import { getLanguage } from '@/utils/utils';
import { computed } from 'vue';
import { formatNumber } from '@/utils/format';
import { useExpensesStore } from '@/stores/expenses';
import { storeToRefs } from 'pinia';
import ScatterChart from '@/components/general/charts/ScatterChart.vue';

const expensesStore = useExpensesStore();
const { expenses, loading } = storeToRefs(expensesStore);

const monthsThisYear = computed(() => {
  return getRangeBetweenDates(
    adjustCalendarDate('start', 'year'),
    adjustCalendarDate('end', 'year'),
    'months',
    'date',
  );
});
</script>

<template>
  <ScatterChart
    v-if="!loading"
    class="max-h-64"
    :xAxis="[
      {
        data: monthsThisYear.map(p => {
          p.setDate(15);
          return p;
        }),
        scaleType: 'utc',
        valueFormatter: value => {
          return value === null
            ? ''
            : new Date(value).toLocaleDateString(getLanguage(), {
                month: 'short',
              });
        },
      },
    ]"
    :yAxis="[
      {
        valueFormatter: value => {
          const formattedNumber = formatNumber(
            parseInt((value || 0).toString()),
            {
              style: 'currency',
              currency: 'NOK',
              currencyDisplay: 'narrowSymbol',
              maximumFractionDigits: 0,
            },
          );
          return value === null ? '' : formattedNumber;
        },
      },
    ]"
    :dataset="
      expenses.map(p => ({
        ...p,
        date: new Date(p.date),
      }))
    "
    :series="[
      {
        datasetKeys: {
          id: 'id',
          x: 'date',
          y: 'cost',
        },
      },
    ]"
    :margin="{ top: 10, right: 20, bottom: 20 }"
  />
</template>
