<script setup lang="ts">
import {
  addToDate,
  adjustCalendarDate,
  getRangeBetweenDates,
  toLocaleISODate,
  toLocalPeriod,
} from '@/utils/date';
import { getLanguage } from '@/utils/utils';
import { computed, reactive } from 'vue';

const selectedDate = defineModel<Date>({
  required: false,
  default: new Date(),
});
const settings = reactive<{
  view: 'none' | 'year' | 'month' | 'week';
  selectedPeriod: string;
}>({
  view: 'none',
  selectedPeriod: toLocalPeriod(new Date()),
});

const daysOfMonth = computed(() =>
  getRangeBetweenDates(
    adjustCalendarDate(
      'start',
      'week',
      adjustCalendarDate(
        'start',
        'month',
        new Date(settings.selectedPeriod),
        1,
      ),
      1,
    ),
    adjustCalendarDate(
      'end',
      'week',
      adjustCalendarDate('end', 'month', new Date(settings.selectedPeriod), 1),
      1,
    ),
    'days',
    'date',
  ),
);

const years = Array.from(
  { length: 2100 - 1900 + 1 },
  (_, index) => 1900 + index,
);

const months = Array.from({ length: 12 }, (_, index) => index + 1).map(
  month => {
    return new Date(
      `${Number(settings.selectedPeriod.substring(0, 4))}-${month}-01`,
    );
  },
);

const handleDateSelect = (date: Date) => {
  const { selectedPeriod } = settings;

  const currentYear = Number(selectedPeriod.substring(0, 4));
  const currentMonth = Number(selectedPeriod.substring(5)) - 1;

  const selectedYear = date.getFullYear();
  const selectedMonth = date.getMonth();

  selectedDate.value = date;

  const monthDiff =
    (selectedYear - currentYear) * 12 + (selectedMonth - currentMonth);

  console.log(
    'selectm',
    selectedPeriod,
    date.getMonth(),
    parseInt(selectedPeriod.substring(5)) - 1,
    'diff',
    monthDiff,
  );
  if (monthDiff !== 0) {
    navigateMonth(monthDiff > 0 ? 1 : -1);
  }
};

const navigateMonth = (change: -1 | 1) => {
  const newDate = addToDate(new Date(settings.selectedPeriod), change, 'month');

  settings.selectedPeriod = toLocalPeriod(newDate);
};

const selectYear = (year: number) => {
  const newDate = new Date(settings.selectedPeriod);
  newDate.setFullYear(year);

  settings.selectedPeriod = toLocalPeriod(newDate);

  settings.view = 'month';
};

const selectMonth = (month: number) => {
  const newDate = new Date(settings.selectedPeriod);
  newDate.setMonth(month);

  settings.selectedPeriod = toLocalPeriod(newDate);

  settings.view = 'none';
};
</script>

<template>
  <div class="dropdown">
    <div tabindex="0" role="button" class="btn" v-bind="$attrs">Date</div>
    <div
      tabindex="0"
      class="dropdown-content z-[1] w-64 p-2 shadow bg-base-300 rounded-box"
    >
      <div
        class="text-center lg:col-start-9 lg:col-end-13 lg:row-start-1 xl:col-start-9"
      >
        <div class="flex items-center">
          <button
            type="button"
            class="btn btn-sm btn-circle btn-ghost"
            @click="navigateMonth(-1)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-5 h-5 fill-current"
            >
              <path
                fill-rule="evenodd"
                d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <div
            class="flex-auto dropdown"
            :class="{ 'dropdown-open': settings.view !== 'none' }"
          >
            <div
              tabindex="0"
              role="button"
              class="btn btn-sm"
              @click="settings.view = 'year'"
            >
              {{
                new Date(settings.selectedPeriod).toLocaleDateString(
                  getLanguage(),
                  {
                    month: 'long',
                    year: 'numeric',
                  },
                )
              }}
            </div>

            <div
              class="dropdown-content overflow-y-auto overflow-x-hidden max-h-52 z-10 bg-base-100 text-base-content rounded-box"
            >
              <ul
                v-if="settings.view === 'year'"
                tabindex="0"
                class="menu w-52 p-2 shadow"
              >
                <li v-for="year in years" :key="year" class="">
                  <button @click="selectYear(year)">{{ year }}</button>
                </li>
              </ul>
              <ul
                v-if="settings.view === 'month'"
                tabindex="0"
                class="menu w-52 p-2 shadow"
              >
                <li
                  v-for="(month, monthIndex) in months"
                  :key="monthIndex"
                  class=""
                >
                  <button @click="selectMonth(month.getMonth())">
                    {{
                      month.toLocaleDateString(getLanguage(), { month: 'long' })
                    }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-circle btn-ghost"
            @click="navigateMonth(1)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-5 h-5 fill-current"
            >
              <path
                fill-rule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div class="mt-6 grid grid-cols-7 text-xs">
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
          <div>S</div>
        </div>

        <div
          class="isolate mt-2 grid grid-cols-7 rounded-lg bg-gray-300 text-sm ring-1 ring-zinc-500 gap-px"
        >
          <button
            v-for="(date, dateIndex) in daysOfMonth"
            :key="`date-${dateIndex}`"
            type="button"
            class="py-1.5 hover:bg-gray-100"
            :class="{
              'rounded-tl-lg': dateIndex === 0,
              'rounded-tr-lg': dateIndex === 6,
              'rounded-bl-lg': dateIndex === daysOfMonth.length - 7,
              'rounded-br-lg': dateIndex === daysOfMonth.length - 1,
              'bg-gray-100 text-stone-500':
                toLocalPeriod(date) !== settings.selectedPeriod,
              'bg-white text-black':
                toLocalPeriod(date) === settings.selectedPeriod,
              'text-primary':
                toLocaleISODate(date) === toLocaleISODate(new Date()) &&
                toLocaleISODate(date) !== toLocaleISODate(selectedDate),
              'text-white':
                toLocaleISODate(date) === toLocaleISODate(selectedDate),
            }"
            @click="handleDateSelect(date)"
          >
            <time
              :datetime="toLocaleISODate(date)"
              class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
              :class="{
                'font-semibold':
                  toLocaleISODate(date) === toLocaleISODate(new Date()) ||
                  toLocaleISODate(date) === toLocaleISODate(selectedDate),
                'bg-black':
                  toLocaleISODate(date) === toLocaleISODate(selectedDate),
              }"
            >
              {{ date.getDate() }}
            </time>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
