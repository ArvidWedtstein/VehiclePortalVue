<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { RouterLink, useRoute } from 'vue-router';
import { computed, defineAsyncComponent, onBeforeMount, ref, watch } from 'vue';

import { storeToRefs } from 'pinia';
import { useExpensesStore } from '@/stores/expenses';
import { formatDate } from '@/utils/date';
import { formatNumber } from '@/utils/format';
import { useConfirm } from '@/lib/composables/useConfirm';
import { useProfilesStore } from '@/stores/profiles';
import EditIcon from '@/assets/icons/EditIcon.vue';
import TrashIcon from '@/assets/icons/TrashIcon.vue';
import ChevronRight from '@/assets/icons/ChevronRight.vue';

const ExpenseModal = defineAsyncComponent(
  async () => await import('@/components/vehicles/expenses/ExpenseModal.vue'),
);

const vehiclesStore = useVehiclesStore();
const expensesStore = useExpensesStore();
const profilesStore = useProfilesStore();

const { profiles } = storeToRefs(profilesStore);

const { currentVehicle } = storeToRefs(vehiclesStore);
const { expenses, loading } = storeToRefs(expensesStore);
const { getExpenses, deleteExpense } = expensesStore;

const expenseModal = ref<InstanceType<typeof ExpenseModal>>();

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

const createdBy = computed(() => {
  return profiles.value.find(
    ({ user_id }) => user_id === expense.value.createdby_id,
  );
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
    class="flex items-center gap-2 mb-2 leading-none"
  >
    <ChevronRight class="w-3" />
    Back to expenses
  </RouterLink>

  <ExpenseModal ref="expenseModal" />

  <div
    v-if="!loading && expense"
    class="card card-compact md:card-normal bg-base-100 md:w-96 shadow-xl"
  >
    <div class="card-body">
      <h2 class="card-title">{{ expense.type }}</h2>

      <ul class="flex flex-col gap-1 text-sm">
        <li class="inline-flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="w-4 fill-current"
          >
            <path
              d="M256 16C123.451 16 16 123.451 16 256S123.451 496 256 496S496 388.549 496 256S388.549 16 256 16ZM256 448C211.934 448 171.41 432.922 138.971 407.865C159.469 383.609 189.818 368 224 368H288C322.182 368 352.467 383.66 372.949 407.924C340.523 432.945 300.031 448 256 448ZM407.381 373.676C378.084 340.795 335.508 320 288 320H224C176.484 320 133.934 340.816 104.658 373.727C79.279 341.174 64 300.379 64 256C64 150.131 150.131 64 256 64S448 150.131 448 256C448 300.355 432.736 341.133 407.381 373.676ZM256 112C207.398 112 168 151.398 168 200C168 248.6 207.398 288 256 288S344 248.6 344 200C344 151.398 304.602 112 256 112ZM256 240C233.943 240 216 222.055 216 200C216 177.943 233.943 160 256 160S296 177.943 296 200C296 222.055 278.057 240 256 240Z"
            />
          </svg>

          <RouterLink
            class="link link-hover"
            :to="{ name: 'profile', params: { id: createdBy?.id } }"
          >
            {{ createdBy?.name }}
          </RouterLink>
        </li>
        <li class="inline-flex gap-2 items-center">
          <!-- <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            class="w-3 aspect-square fill-current"
          >
            <path
              d="M384 64H344V24C344 10.75 333.25 0 320 0S296 10.75 296 24V64H152V24C152 10.75 141.25 0 128 0S104 10.75 104 24V64H64C28.654 64 0 92.652 0 128V448C0 483.348 28.654 512 64 512H384C419.346 512 448 483.348 448 448V128C448 92.652 419.346 64 384 64ZM384 464H64C55.178 464 48 456.824 48 448V192H400V448C400 456.824 392.822 464 384 464Z"
            />
          </svg> -->
          <span class="font-semibold">Date:</span>
          <span>
            {{
              formatDate(expense.date, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })
            }}
          </span>
        </li>
        <li class="inline-flex gap-2 items-center">
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
        <li class="inline-flex gap-2 items-center">
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
        <li class="inline-flex gap-2 items-center">
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
        <li class="inline-flex gap-2 items-center">
          <span class="font-semibold">
            Price per
            {{ expense.unit || 'liter' }}:
          </span>
          <span>
            {{
              formatNumber(expense.price_per_unit || 0, {
                style: 'currency',
                currency: expense.currency || 'EUR',
                currencyDisplay: 'narrowSymbol',
                maximumFractionDigits: 2,
              })
            }}
          </span>
        </li>
      </ul>

      <div class="divider my-0 font-semibold text-sm">Notes:</div>

      <p class="capitalize text-sm mb-2">{{ expense.notes }}</p>

      <div class="card-actions justify-between">
        <button
          type="button"
          class="btn btn-sm"
          @click="expenseModal?.open(expense.id)"
        >
          <EditIcon class="w-3" />
          Edit
        </button>

        <button
          type="button"
          class="btn btn-sm btn-outline btn-error"
          @click="handleExpenseDelete"
        >
          <TrashIcon class="w-3" />
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
