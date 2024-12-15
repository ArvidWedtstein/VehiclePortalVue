<script
  setup
  lang="ts"
  generic="ChartData extends ReadonlyArray<{ id: string; name: string }>"
>
import LineChart from '@/components/general/charts/LineChart.vue';
import FormInput from '@/components/general/form/FormInput.vue';
import { adjustCalendarDate, getRangeBetweenDates } from '@/utils/date';
import { getLanguage, groupBy } from '@/utils/utils';
import { useServicesStore } from '@/stores/services';
import { computed, reactive, toRef } from 'vue';
import { formatNumber } from '@/utils/format';

const servicesStore = useServicesStore();
const services = toRef(servicesStore, 'services');

type ChartSettings<T extends ReadonlyArray<{ id: string; name: string }>> = {
  options: T;
  selectedMode: T[number]['id'];
  selectedCurrency: string;
  currencyFormatOptions: Intl.NumberFormatOptions;
};

const chartSettings = reactive<ChartSettings<ChartData>>({
  options: [
    { id: 'costThisYear', name: 'Cost this Year' },
    { id: 'repairsPerMonth', name: 'Repairs Per Month' },
  ] as unknown as ChartData,
  selectedCurrency: 'NOK',
  selectedMode: 'costThisYear',
  /** TODO: find solution for when user has registered services in different currencies */
  currencyFormatOptions: {
    style: 'currency',
    currency: 'NOK',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    notation: 'compact',
  },
});

const monthsThisYear = computed(() => {
  return getRangeBetweenDates(
    adjustCalendarDate('start', 'year'),
    adjustCalendarDate('end', 'year'),
    'months',
    'date',
  );
});

const serviceData = computed(() => {
  const language = getLanguage();

  const servicesGroupedByMonth = groupBy(
    services.value.map(s => {
      const monthYear = new Date(s.date).toLocaleDateString(language, {
        month: 'short',
        year: 'numeric',
      });

      return {
        ...s,
        monthYear,
      };
    }),
    'monthYear',
  );

  const servicesGrouped = monthsThisYear.value.map(date => {
    const monthYear = date.toLocaleDateString(getLanguage(), {
      month: 'short',
      year: 'numeric',
    });

    const items = servicesGroupedByMonth[monthYear] || [];

    const totalCost = items.reduce(
      (costAcc, currentItem) => costAcc + (currentItem.cost || 0),
      0,
    );

    return {
      monthYear,
      cost: totalCost,
      repairs: items.length,
    };
  }, []);

  return servicesGrouped;
});
</script>

<template>
  <div class="flex flex-col items-center text-center">
    <div class="flex items-center justify-end gap-1 w-full">
      <!-- 
            TODO: finish 
            All costs not in selected currency must be formatted somehow?
          -->
      <FormInput
        type="select"
        size="xs"
        wrapperClass="max-w-36"
        v-model="chartSettings.selectedCurrency"
        :options="
          services
            .map(({ currency }) => currency || 'EUR')
            .filter((value, index, array) => array.indexOf(value) === index)
            .map(currency => ({ value: currency || 'EUR' }))
        "
      />
      <select
        class="select select-bordered select-xs w-full max-w-48"
        v-model="chartSettings.selectedMode"
      >
        <option
          v-for="{ id, name } in chartSettings.options"
          :key="id"
          :value="id"
        >
          {{ name }}
        </option>
      </select>
    </div>
    <LineChart
      class="max-h-64"
      :xAxis="[
        {
          data: monthsThisYear.map(p => {
            p.setDate(15);
            return p.toLocaleDateString(getLanguage(), {
              month: 'short',
            });
          }),
          scaleType: 'band',
        },
      ]"
      :yAxis="[
        {
          valueFormatter: value => {
            const formattedNumber = formatNumber(
              parseInt((value || 0).toString()),
              chartSettings.selectedMode === 'costThisYear'
                ? chartSettings.currencyFormatOptions
                : undefined,
            );
            return value === null ? '' : formattedNumber;
          },
        },
      ]"
      :dataset="serviceData"
      :series="[
        {
          dataKey:
            chartSettings.selectedMode === 'costThisYear' ? 'cost' : 'repairs',
          showMark: value => !!value,
        },
      ]"
      :grid="{
        vertical: true,
      }"
      :margin="{ top: 10, right: 10, bottom: 20 }"
    />
  </div>
</template>
