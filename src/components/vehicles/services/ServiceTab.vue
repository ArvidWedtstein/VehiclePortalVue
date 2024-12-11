<script
  setup
  lang="ts"
  generic="ChartData extends ReadonlyArray<{ id: string; name: string }>"
>
import ServiceModal from './ServiceModal.vue';
import { useServicesStore } from '@/stores/services';
import { computed, onMounted, reactive, ref, toRef } from 'vue';
import {
  adjustCalendarDate,
  formatDate,
  getRangeBetweenDates,
} from '@/utils/date';
import LineChart from '@/components/general/charts/LineChart.vue';
import { getLanguage, groupBy } from '@/utils/utils';
import { formatNumber } from '@/utils/format';

const servicesStore = useServicesStore();

const services = toRef(servicesStore, 'services');
const { getServices, deleteService } = servicesStore;

const serviceModal = ref();

type ChartSettings<T extends ReadonlyArray<{ id: string; name: string }>> = {
  options: T;
  selectedMode: T[number]['id'];
  currencyFormatOptions: Intl.NumberFormatOptions;
};

const chartSettings = reactive<ChartSettings<ChartData>>({
  options: [
    { id: 'costThisYear', name: 'Cost this Year' },
    { id: 'repairsPerMonth', name: 'Repairs Per Month' },
  ] as unknown as ChartData,
  selectedMode: 'costThisYear',
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

onMounted(async () => {
  await getServices();
});
</script>

<template>
  <ServiceModal ref="serviceModal" />

  <div class="flex justify-between">
    <button type="button" class="btn" @click="serviceModal.open()">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        class="w-4 fill-current"
      >
        <path
          d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"
        />
      </svg>
      Add Service
    </button>

    <div
      class="hidden md:card card-bordered card-compact bg-neutral text-neutral-content w-1/2 mt-2"
    >
      <div class="card-body items-center text-center">
        <div class="flex justify-end w-full">
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
                chartSettings.selectedMode === 'costThisYear'
                  ? 'cost'
                  : 'repairs',
              showMark: value => !!value,
            },
          ]"
          :grid="{
            vertical: true,
          }"
          :margin="{ top: 10, right: 10, bottom: 20 }"
        />
      </div>
    </div>
  </div>

  <ul class="mt-4 text-sm divide-y divide-neutral max-h-96 overflow-y-auto">
    <li
      class="relative flex items-center space-x-6 py-3"
      v-for="(service, index) in services"
      :key="index"
    >
      <div class="w-10 h-10 flex-none rounded-full border">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          class="h-10 w-10 p-2 fill-current"
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
                class="h-5 w-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
                  clip-rule="evenodd"
                />
              </svg>
            </dt>
            <dd>
              <time v-if="service.date" :datetime="service.date">{{
                formatDate(service.date)
              }}</time>
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
        <button
          type="button"
          class="md:hidden btn btn-sm mr-3"
          @click="serviceModal.open(service.id)"
        >
          Edit
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="h-3 w-3 fill-current"
          >
            <path
              d="M455.703 18.748C443.209 6.252 426.829 0 410.452 0C394.07 0 377.695 6.25 365.196 18.75L45.11 338.885C36.542 347.451 30.584 358.275 27.926 370.094L0.319 492.854C-1.701 502.967 6.158 512 15.946 512C16.993 512 18.061 511.896 19.143 511.68C19.143 511.68 103.751 493.73 141.894 484.748C153.432 482.031 163.759 476.225 172.139 467.844C221.264 418.719 406.649 233.33 493.302 146.676C518.294 121.684 518.202 81.256 493.212 56.262L455.703 18.748ZM138.201 433.902C136.086 436.018 133.697 437.365 130.893 438.025C112.719 442.307 83.432 448.738 58.204 454.203L74.751 380.627C75.417 377.668 76.902 374.973 79.048 372.824L320.936 130.902L381.064 191.035L138.201 433.902Z"
            />
          </svg>
        </button>
        <div class="hidden md:dropdown dropdown-end">
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
              />
            </svg>
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li>
              <button type="button" @click="serviceModal.open(service.id)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  class="h-3 w-3 fill-current"
                >
                  <path
                    d="M455.703 18.748C443.209 6.252 426.829 0 410.452 0C394.07 0 377.695 6.25 365.196 18.75L45.11 338.885C36.542 347.451 30.584 358.275 27.926 370.094L0.319 492.854C-1.701 502.967 6.158 512 15.946 512C16.993 512 18.061 511.896 19.143 511.68C19.143 511.68 103.751 493.73 141.894 484.748C153.432 482.031 163.759 476.225 172.139 467.844C221.264 418.719 406.649 233.33 493.302 146.676C518.294 121.684 518.202 81.256 493.212 56.262L455.703 18.748ZM138.201 433.902C136.086 436.018 133.697 437.365 130.893 438.025C112.719 442.307 83.432 448.738 58.204 454.203L74.751 380.627C75.417 377.668 76.902 374.973 79.048 372.824L320.936 130.902L381.064 191.035L138.201 433.902Z"
                  />
                </svg>
                Edit
              </button>
            </li>
            <li>
              <button type="button" @click="deleteService(service.id)">
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
