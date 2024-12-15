<script setup lang="ts">
import ExpenseModal from '@/components/vehicles/expenses/ExpenseModal.vue';
import { onMounted, ref, toRefs } from 'vue';
import { formatDate } from '@/utils/date';
import { useExpensesStore } from '@/stores/expenses';
import type { Tables } from '@/database.types';
import { useConfirm } from '@/lib/hooks/useConfirm';
import MenuItem from '@/components/general/menu/MenuItem.vue';

const expenseStore = useExpensesStore();

const { expenses } = toRefs(expenseStore);
const { getExpenses, deleteExpense } = expenseStore;

const expenseModal = ref();

const handleExpenseDelete = async (
  expense_id: Tables<'VehicleExpenses'>['id'],
) => {
  const result = await useConfirm({
    title: 'Delete Expense?',
    message:
      'Are you sure you want to delete this expense? This cannot be undone.',
    confirmLabel: 'Delete',
    severity: 'danger',
  });

  if (!result) return;

  deleteExpense(expense_id);
};

onMounted(async () => {
  getExpenses();
});
</script>

<template>
  <ExpenseModal ref="expenseModal" />

  <div class="flex justify-between">
    <button type="button" class="btn btn-accent" @click="expenseModal.open()">
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
  </div>

  <ul
    class="my-4 mb-14 md:mb-4 text-sm divide-y divide-neutral h-auto md:max-h-[50vh] overflow-y-auto"
  >
    <li
      class="relative flex items-center space-x-6 py-3"
      v-for="(expense, index) in expenses"
      :key="index"
    >
      <div class="w-10 h-10 flex-none rounded-full border">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          class="h-10 w-10 p-2"
          fill="currentColor"
        >
          <path
            d="M32 64C32 28.7 60.7 0 96 0L256 0c35.3 0 64 28.7 64 64l0 192 8 0c48.6 0 88 39.4 88 88l0 32c0 13.3 10.7 24 24 24s24-10.7 24-24l0-154c-27.6-7.1-48-32.2-48-62l0-64L384 64c-8.8-8.8-8.8-23.2 0-32s23.2-8.8 32 0l77.3 77.3c12 12 18.7 28.3 18.7 45.3l0 13.5 0 24 0 32 0 152c0 39.8-32.2 72-72 72s-72-32.2-72-72l0-32c0-22.1-17.9-40-40-40l-8 0 0 144c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32L32 64zM96 80l0 96c0 8.8 7.2 16 16 16l128 0c8.8 0 16-7.2 16-16l0-96c0-8.8-7.2-16-16-16L112 64c-8.8 0-16 7.2-16 16z"
          />
        </svg>
      </div>

      <div class="flex-1">
        <h3 class="capitalize font-semibold xl:pr-0">
          {{ expense.type }}
        </h3>
        <dl class="mt-2 flex flex-col xl:flex-row">
          <div class="flex items-center flex-nowrap space-x-2">
            <dt class="mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                aria-hidden="true"
                class="h-5 w-5 fill-current"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
                  clip-rule="evenodd"
                />
              </svg>
            </dt>
            <dd>
              <time :datetime="expense.date">{{
                formatDate(expense.date, { dateStyle: 'medium' })
              }}</time>
            </dd>
          </div>

          <div
            class="mt-2 flex items-center space-x-2 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-neutral xl:pl-3.5"
          >
            <dt class="mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                class="h-5 w-5 fill-current"
              >
                <path
                  fill-rule="evenodd"
                  d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
                  clip-rule="evenodd"
                />
              </svg>
            </dt>
            <dd class="capitalize">{{ expense.notes }}</dd>
          </div>
        </dl>
      </div>
      <div class="xl:relative">
        <RouterLink
          class="md:hidden btn btn-sm mr-3"
          :to="{
            name: 'expense',
            params: {
              id: expense.id,
            },
          }"
        >
          Details
        </RouterLink>
        <div class="hidden md:dropdown dropdown-end">
          <div
            tabindex="0"
            role="button"
            class="btn btn-sm btn-ghost btn-circle flex mr-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="h-5 w-5 fill-current"
            >
              <path
                d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
              />
            </svg>
          </div>

          <ul
            tabindex="0"
            class="dropdown-content menu menu-sm bg-base-300 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li>
              <RouterLink
                :to="{
                  name: 'expense',
                  params: {
                    id: expense.id,
                  },
                }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  class="w-3 fill-current"
                >
                  <path
                    d="M572.531 238.973C518.281 115.525 410.938 32 288 32S57.688 115.58 3.469 238.973C1.562 243.402 0 251.041 0 256C0 260.977 1.562 268.596 3.469 273.025C57.719 396.473 165.062 480 288 480S518.312 396.418 572.531 273.025C574.438 268.596 576 260.957 576 256C576 251.023 574.438 243.402 572.531 238.973ZM288 432C188.521 432 96.836 364.502 48.424 256.004C97.01 147.365 188.611 80 288 80C387.48 80 479.164 147.498 527.576 255.994C478.99 364.635 387.389 432 288 432ZM288 128C217.334 128 160 185.348 160 256S217.334 384 288 384H288.057C358.695 384 416 326.68 416 256.055V256C416 185.348 358.668 128 288 128ZM288 336C243.889 336 208 300.111 208 256C208 255.252 208.199 254.559 208.221 253.816C213.277 255.125 218.52 256 224 256C259.346 256 288 227.346 288 192C288 186.52 287.125 181.277 285.816 176.221C286.559 176.199 287.252 176 288 176C332.111 176 368 211.889 368 256.055C368 300.137 332.137 336 288 336Z"
                  />
                </svg>
                View
              </RouterLink>
            </li>
            <MenuItem @click="expenseModal.open(expense.id)">
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
            </MenuItem>

            <li>
              <button type="button" @click="handleExpenseDelete(expense.id)">
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
            </li>
          </ul>
        </div>
      </div>
    </li>
  </ul>
</template>
