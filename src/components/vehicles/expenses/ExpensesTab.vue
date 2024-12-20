<script async setup lang="ts">
import { defineAsyncComponent, ref, toRefs } from 'vue';
import { formatDate } from '@/utils/date';
import { useExpensesStore } from '@/stores/expenses';
import MenuItem from '@/components/general/menu/MenuItem.vue';
import ListGroup from '@/components/general/list/ListGroup.vue';
import ListGroupItem from '@/components/general/list/ListGroupItem.vue';
import { parseRowsToTable } from '@/utils/utils';
import { exportToTxt } from '@/utils/export';
// import { useVirtualScroll } from '@/lib/composables/useVirtualScroll';

const ExpenseModal = defineAsyncComponent(
  async () => await import('@/components/vehicles/expenses/ExpenseModal.vue'),
);

const expenseStore = useExpensesStore();

const { expenses, loading } = toRefs(expenseStore);

const expenseModal = ref();

// const {
//   visibleItems,
//   totalItems,
//   loading: virtualLoading,
// } = useVirtualScroll(getExpenses, 88, 5, containerRef);

const handleExpensesExport = () => {
  const table = parseRowsToTable(expenses.value, [
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
  ]);

  exportToTxt(table, 'expenses');
};
</script>

<template>
  <ExpenseModal ref="expenseModal" />

  <div class="flex justify-between">
    <button
      type="button"
      class="btn btn-accent btn-block md:w-auto"
      @click="expenseModal.open()"
    >
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

    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-ghost btn-accent">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          class="w-4 fill-current"
        >
          <path
            d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"
          />
        </svg>
        Export
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          class="w-2 fill-current"
        >
          <path
            d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
          />
        </svg>
      </div>
      <ul
        tabindex="0"
        class="dropdown-content menu bg-base-300 rounded-box z-[1] w-52 p-2 shadow"
      >
        <MenuItem @click="handleExpensesExport">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            class="fill-current w-3"
          >
            <path
              d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
            />
          </svg>
          Text File
        </MenuItem>
      </ul>
    </div>
  </div>

  <ListGroup class="h-auto md:max-h-[50vh] divide-y divide-neutral">
    <ListGroupItem
      v-for="(expense, index) in expenses"
      :key="index"
      :title="expense.type"
      as="RouterLink"
      class="hover:bg-base-content/5 transition-colors"
      :to="{
        name: 'expense',
        params: {
          id: expense.id,
        },
      }"
    >
      <template #icon="{ sizeClass }">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          class="fill-current p-2"
          :class="sizeClass"
        >
          <path
            d="M32 64C32 28.7 60.7 0 96 0L256 0c35.3 0 64 28.7 64 64l0 192 8 0c48.6 0 88 39.4 88 88l0 32c0 13.3 10.7 24 24 24s24-10.7 24-24l0-154c-27.6-7.1-48-32.2-48-62l0-64L384 64c-8.8-8.8-8.8-23.2 0-32s23.2-8.8 32 0l77.3 77.3c12 12 18.7 28.3 18.7 45.3l0 13.5 0 24 0 32 0 152c0 39.8-32.2 72-72 72s-72-32.2-72-72l0-32c0-22.1-17.9-40-40-40l-8 0 0 144c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32L32 64zM96 80l0 96c0 8.8 7.2 16 16 16l128 0c8.8 0 16-7.2 16-16l0-96c0-8.8-7.2-16-16-16L112 64c-8.8 0-16 7.2-16 16z"
          />
        </svg>
      </template>

      <template #subtitle>
        <dl class="flex items-center flex-nowrap space-x-1">
          <dt>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-4 fill-current"
            >
              <path
                fill-rule="evenodd"
                d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
                clip-rule="evenodd"
              />
            </svg>
          </dt>
          <dd class="md:pr-2">
            <time :datetime="expense.date">
              {{ formatDate(expense.date, { dateStyle: 'medium' }) }}
            </time>
          </dd>

          <dt
            class="hidden md:block md:border-l xl:border-neutral md:ml-2 md:pl-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-4 fill-current"
            >
              <path
                fill-rule="evenodd"
                d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
                clip-rule="evenodd"
              />
            </svg>
          </dt>
          <dd class="hidden md:block capitalize">{{ expense.notes }}</dd>
        </dl>
      </template>

      <template #endIcon>
        <RouterLink
          class="btn btn-sm mr-3"
          :to="{
            name: 'expense',
            params: {
              id: expense.id,
            },
          }"
        >
          Details
        </RouterLink>
      </template>
    </ListGroupItem>

    <ListGroupItem v-if="loading" title="Loading..." />
  </ListGroup>
</template>
