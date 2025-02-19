<script async setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  reactive,
  ref,
  toRef,
  toRefs,
} from 'vue';
import { useExpensesStore } from '@/stores/expenses';
import { dynamicSort, groupBy, type ArrayElement } from '@/utils/utils';
import {
  downloadBlob,
  exportToCSV,
  exportToTxt,
  parseRowsToTable,
} from '@/utils/export';
import { formatNumber } from '@/utils/format';
import { formatDate } from '@/utils/date';
import MenuItem from '@/components/general/menu/MenuItem.vue';
import ListGroup from '@/components/general/list/ListGroup.vue';
import ListSubGroup from '@/components/general/list/ListSubGroup.vue';
import ListGroupItem from '@/components/general/list/ListGroupItem.vue';
import { useBreakpoints } from '@/lib/composables/useBreakpoints';
import { type FilterOption } from '@/components/general/filter/FilterMenu.vue';
import { useSessionStore } from '@/stores/general/userSession';
import ExpensesFilter from './ExpensesFilter.vue';
import DropdownMenu from '@/components/general/menu/DropdownMenu.vue';
// import { useVirtualScroll } from '@/lib/composables/useVirtualScroll';

const ExpenseModal = defineAsyncComponent(
  async () => await import('@/components/vehicles/expenses/ExpenseModal.vue'),
);

const { isMd } = useBreakpoints();

const expenseStore = useExpensesStore();
const { expenses, loading } = toRefs(expenseStore);

const sessionStore = useSessionStore();
const session = toRef(sessionStore, 'session');

const expenseModal = ref<InstanceType<typeof ExpenseModal>>();

// const {
//   visibleItems,
//   totalItems,
//   loading: virtualLoading,
// } = useVirtualScroll(getExpenses, 88, 5, containerRef);

const handleExpensesExport = (type: 'txt' | 'csv') => {
  const columnsToExport: Array<keyof ArrayElement<typeof expenses.value>> = [
    'type',
    'vehicle_id',
    'date',
    'cost',
    'currency',
    'amount',
    'unit',
    'price_per_unit',
    'mileage',
    'notes',
  ];
  const table = parseRowsToTable(expenses.value, columnsToExport);

  let blob: Blob | null = null;

  switch (type) {
    case 'txt':
      blob = exportToTxt(table);
      break;
    case 'csv':
      blob = exportToCSV(expenses.value, columnsToExport);
      break;
  }

  downloadBlob(blob, `expenses.${type}`);
};

const filters = ref<Array<FilterOption>>([]);
const sortControl = reactive<{
  key: keyof ArrayElement<typeof expenses.value>;
  direction: 'asc' | 'desc';
  options: Array<{
    label?: string;
    value: keyof ArrayElement<typeof expenses.value>;
  }>;
}>({
  key: 'date',
  direction: 'desc',
  options: [
    { value: 'date', label: 'Date' },
    { value: 'cost', label: 'Cost' },
    { value: 'amount', label: 'Amount' },
  ],
});

const filterMappings: Record<
  string,
  keyof ArrayElement<typeof expenses.value>
> = { Date: 'date', Currency: 'currency', 'Created by me': 'createdby_id' };

const groupedExpenses = computed(() => {
  const filteredExpenses = expenses.value.filter(expense => {
    return filters.value.every(filter => {
      const field = filterMappings[filter.title];
      if (!field) return true;

      const fieldValue = expense[field];

      if (filter.type === 'from-to-date') {
        const { from, to } = filter.value as { from: string; to: string };
        const itemDate = new Date(fieldValue || '');
        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (from && to) {
          return itemDate >= fromDate && itemDate <= toDate;
        } else if (from) {
          return itemDate >= fromDate;
        } else if (to) {
          return itemDate <= toDate;
        }

        return true;
      }

      if (filter.type === 'radio') {
        return fieldValue === filter.value;
      }

      if (filter.type === 'text') {
        return fieldValue?.toString().includes(filter.value?.toString() || '');
      }

      if (filter.type === 'checkbox') {
        const filterValues = filter.value as string[];

        return (
          filterValues.includes(fieldValue?.toString() || '') ||
          !filterValues.length
        );
      }

      if (filter.type === 'boolean' && filter.value) {
        if (filter.title === 'Created by me') {
          return fieldValue?.toString() === session.value?.user.id;
        }

        return true;
      }

      return true;
    });
  });

  const sortedExpenses = dynamicSort(
    filteredExpenses,
    sortControl.key,
    sortControl.direction,
  );

  const expensesWithMonth = sortedExpenses.map(expense => {
    const monthYear = formatDate(
      expense.date,
      sortControl.key === 'date'
        ? { year: 'numeric', month: 'long' }
        : { year: 'numeric' },
    );

    return {
      ...expense,
      monthYear,
    };
  });

  const grouped = groupBy(expensesWithMonth, 'monthYear');

  return grouped;
});

const handleFilterApply = async (filterOptions: Array<FilterOption>) => {
  filters.value = filterOptions;
};

const handleFiltersReset = () => {
  filters.value = [];
};

const setSortKey = (key: keyof ArrayElement<typeof expenses.value>) => {
  sortControl.key = key;
};
</script>

<template>
  <ExpenseModal ref="expenseModal" />

  <div class="flex justify-between">
    <button type="button" class="btn btn-accent w-auto" @click="expenseModal?.open()">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-4 fill-current">
        <path
          d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
      </svg>
      <span class="hidden sm:block">Add Expense</span>
    </button>

    <div class="join">
      <ExpensesFilter @reset="handleFiltersReset" @apply="handleFilterApply" class="join-item" />

      <DropdownMenu btnClass="btn btn-outline join-item">
        <template #default>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="size-4 fill-current sm:block hidden">
            <path
              d="M271.978 288.008H48.147C5.531 288.008 -16.09 339.772 14.279 369.905L126.132 481.934C144.753 500.689 175.247 500.689 193.993 481.934L305.971 369.905C335.965 339.772 314.719 288.008 271.978 288.008ZM160 448.05L48.022 336.021H271.978L160 448.05ZM48.022 223.992H271.853C314.469 223.992 336.09 172.228 305.721 142.095L193.868 30.066C175.247 11.311 144.753 11.311 126.007 30.066L14.029 142.095C-15.965 172.228 5.281 223.992 48.022 223.992ZM160 63.95L271.978 175.979H48.022L160 63.95Z" />
          </svg>
          Sorted on:
          <span class="badge badge-neutral">
            {{
              sortControl.options.find(o => o.value === sortControl.key)?.label
            }}
          </span>
        </template>
        <template #items>
          <MenuItem v-for="(option, optionIndex) in sortControl.options" :key="`sortOption-${optionIndex}`"
            :active="sortControl.key === option.value" @click="setSortKey(option.value)">
          {{ option.label ?? option.value }}
          </MenuItem>
        </template>
      </DropdownMenu>
    </div>

    <DropdownMenu btnClass="btn btn-outline join-item w-auto flex-nowrap" alignMenu="end">
      <template #default>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="size-4 fill-current">
          <path
            d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
        </svg>
        <span class="sm:block hidden">Export</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="w-2 fill-current inline">
          <path
            d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
        </svg>
      </template>
      <template #items>
        <MenuItem @click="handleExpensesExport('txt')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="fill-current w-3">
          <path
            d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
        </svg>
        Text File
        </MenuItem>
        <MenuItem @click="handleExpensesExport('csv')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="fill-current w-3">
          <path
            d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
        </svg>
        CSV
        </MenuItem>
      </template>
    </DropdownMenu>
  </div>

  <!-- TODO: fix -->
  <ListGroup class="flex-1 max-h-[calc(100vh-30rem)]" ignoreListClass>
    <ListSubGroup v-for="(expenses, month) in groupedExpenses" :key="month" :title="month.toString()">
      <ListGroupItem v-for="(expense, index) in expenses" :key="index" :title="expense.type" as="RouterLink" :to="{
        name: 'expense',
        params: {
          id: expense.id,
        },
      }">
        <template #icon="{ sizeClass }">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="fill-current p-2" :class="sizeClass">
            <path
              d="M32 64C32 28.7 60.7 0 96 0L256 0c35.3 0 64 28.7 64 64l0 192 8 0c48.6 0 88 39.4 88 88l0 32c0 13.3 10.7 24 24 24s24-10.7 24-24l0-154c-27.6-7.1-48-32.2-48-62l0-64L384 64c-8.8-8.8-8.8-23.2 0-32s23.2-8.8 32 0l77.3 77.3c12 12 18.7 28.3 18.7 45.3l0 13.5 0 24 0 32 0 152c0 39.8-32.2 72-72 72s-72-32.2-72-72l0-32c0-22.1-17.9-40-40-40l-8 0 0 144c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32L32 64zM96 80l0 96c0 8.8 7.2 16 16 16l128 0c8.8 0 16-7.2 16-16l0-96c0-8.8-7.2-16-16-16L112 64c-8.8 0-16 7.2-16 16z" />
          </svg>
        </template>

        <template #subtitle>
          <dl class="flex items-center flex-nowrap gap-1">
            <dt>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="w-4 fill-current">
                <path fill-rule="evenodd"
                  d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
                  clip-rule="evenodd" />
              </svg>
            </dt>
            <dd>
              <time :datetime="expense.date">
                {{
                  formatDate(expense.date, {
                    dateStyle: isMd ? 'medium' : undefined,
                    day: isMd ? undefined : 'numeric',
                  })
                }}
              </time>
            </dd>

            <dd class="border-l border-neutral ml-2 pl-2">
              {{
                formatNumber(expense.amount || 0, {
                  style: 'unit',
                  unit: expense.unit || 'liter',
                })
              }}
            </dd>
          </dl>
        </template>

        <template #endIcon>
          <span class="font-bold">
            {{
              formatNumber(expense.cost || 0, {
                style: 'currency',
                currency: expense.currency || 'EUR',
                currencyDisplay: 'narrowSymbol',
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
              })
            }}
          </span>

          <RouterLink class="btn btn-sm btn-ghost" :to="{
            name: 'expense',
            params: {
              id: expense.id,
            },
          }">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="w-3 fill-current">
              <path
                d="M113.333 47.409L297.314 239.407C301.783 244.032 304.001 250.032 304.001 256.001S301.783 267.969 297.314 272.594L113.333 464.592C104.181 474.186 88.994 474.499 79.431 465.311C69.806 456.186 69.494 440.936 78.712 431.405L246.759 256.001L78.712 80.596C69.494 71.096 69.806 55.815 79.431 46.69C88.994 37.503 104.181 37.815 113.333 47.409Z" />
            </svg>
          </RouterLink>
        </template>
      </ListGroupItem>
    </ListSubGroup>

    <ListGroupItem v-if="loading" title="Loading..." />
    <ListGroupItem v-if="!expenses.length" title="No expenses added yet..." />
  </ListGroup>
</template>
