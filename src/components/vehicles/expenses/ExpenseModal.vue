<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { ref, toRef } from 'vue';
import FormInput from '@/components/general/form/FormInput.vue';
import FormDialog from '@/components/general/modal/FormDialog.vue';

import type { TablesInsert, TablesUpdate } from '@/database.types';
import { useExpensesStore } from '@/stores/expenses';
import { supabase } from '@/lib/supabaseClient';

// TODO: auto-suggest last odometer reading

const modalRef = ref();

const vehiclesStore = useVehiclesStore();
const currentVehicle = toRef(vehiclesStore, 'currentVehicle');

const expensesStore = useExpensesStore();
const expenses = toRef(expensesStore, 'expenses');
const { upsertExpense } = expensesStore;

const defaultValues: TablesUpdate<'VehicleExpenses'> = {
  created_at: new Date().toISOString(),
  vehicle_id: currentVehicle.value?.id || -1,
  expense_date: new Date().toISOString().split('.')[0].slice(0, -3),
  expense_type: '',
  amount: 0,
  notes: '',
  cost: 0,
  currency: 'NOK',
  unit: 'liter',
};

const expense = ref<
  TablesInsert<'VehicleExpenses'> | TablesUpdate<'VehicleExpenses'>
>({ ...defaultValues });

const onFormSubmit = () => {
  console.log('submit', expense.value);

  upsertExpense(expense.value);
  // todo: finish submit
};

const handleOpen = async (
  expense_id: TablesUpdate<'VehicleExpenses'>['id'],
) => {
  const { data: lastExpenseMileage, error } = await supabase.rpc(
    'get_last_mileage',
    {
      vehicle_id: currentVehicle.value?.id || -1,
      type: 'expenses',
    },
  );

  if (error) throw error;

  if (expense_id == null || expense_id === undefined) {
    expense.value = { ...defaultValues, mileage: lastExpenseMileage };
    modalRef.value?.modalRef?.showModal();
    return;
  }

  const editExpense = expenses.value.find(({ id }) => id === expense_id);

  if (!editExpense) {
    alert('No Expense found');
    return;
  }

  expense.value = {
    ...defaultValues,
    ...editExpense,
    expense_date: new Date(editExpense.expense_date || '')
      .toISOString()
      .split('.')[0]
      .slice(0, -3),
  };

  modalRef.value.modalRef.showModal();
};

defineExpose({ modalRef: modalRef, open: handleOpen });
</script>

<template>
  <FormDialog
    id="expenseModal"
    ref="modalRef"
    :title="expense.id ? 'Edit Expense' : 'Create Expense'"
    @submit="onFormSubmit"
  >
    <div class="mt-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
      <FormInput
        wrapperClass="sm:col-span-2"
        label="Date"
        type="datetime-local"
        v-model="expense.expense_date"
        required
      />

      <FormInput
        wrapperClass="sm:col-span-4"
        label="Type"
        type="select"
        v-model="expense.expense_type"
        required
        :options="[
          {
            value: 'diesel',
            label: 'Diesel',
          },
          { value: 'gasoline98', label: 'Gasoline 98' },
          { value: 'gasoline95', label: 'Gasoline 95' },
          { value: 'other', label: 'Other' },
        ]"
        placeholder="Please select a type"
      >
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="w-4 h-4 fill-current"
          >
            <path
              d="M493.173 107.173L417.898 32.039C408.542 22.683 393.378 22.665 384 32L384 32C374.591 41.365 374.574 56.59 383.961 65.977L416 97.875V160C416 188.125 436.875 211.25 464 215.25V376C464 389.25 453.25 400 440 400C426.75 400 416 389.25 416 376V344C416 295.399 376.601 256 328 256H320V64C320 28.654 291.346 0 256 0H96C60.654 0 32 28.654 32 64V464H24C10.8 464 0 474.8 0 488V488C0 501.2 10.8 512 24 512H328C341.2 512 352 501.2 352 488V488C352 474.8 341.2 464 328 464H320V304H328C350.091 304 368 321.909 368 344V371.75C368 409.5 395 443.75 432.5 447.75C475.5 452 512 418.25 512 376V152.625C512 135.577 505.228 119.228 493.173 107.173ZM272 464H80V240H272V464ZM272 192H80V64C80 55.163 87.163 48 96 48H256C264.837 48 272 55.163 272 64V192Z"
            />
          </svg>
        </template>
      </FormInput>

      <FormInput
        wrapperClass="sm:col-span-3"
        class="w-full"
        label="Amount"
        type="text"
        inputmode="numeric"
        join
        v-model.number="expense.amount"
      >
        <template #addon>
          <FormInput
            wrapperClass="max-w-32"
            class="join-item"
            type="select"
            v-model="expense.unit"
            :options="[
              { value: 'liter', label: 'Liter' },
              { value: 'gallon', label: 'Gallon' },
            ]"
          />
        </template>
      </FormInput>

      <FormInput
        wrapperClass="sm:col-span-3"
        class="w-full"
        label="Cost"
        type="text"
        inputmode="decimal"
        join
        v-model.number="expense.cost"
      >
        <template #addon>
          <FormInput
            wrapperClass="max-w-32"
            class="join-item"
            type="select"
            v-model="expense.currency"
            placeholder="Select a currency"
            :options="[
              { value: 'NOK' },
              { value: 'USD' },
              { value: 'EUR' },
              { value: 'SEK' },
              { value: 'DDK' },
            ]"
          />
        </template>
      </FormInput>

      <FormInput
        label="Odometer Reading"
        wrapperClass="sm:col-span-3"
        type="text"
        inputmode="decimal"
        v-model="expense.mileage"
      >
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            class="fill-current w-4 h-4"
          >
            <path
              d="M288 32C129 32 0 161 0 320C0 372.75 14.25 422.25 39 464.75C44.625 474.375 55.375 480 66.5 480H509.5C520.625 480 531.375 474.375 537 464.75C561.75 422.25 576 372.75 576 320C576 161 447 32 288 32ZM288 432C265.945 432 248 414.057 248 392S265.945 352 288 352C310.057 352 328 369.943 328 392S310.057 432 288 432ZM500.25 432H365.965C372.166 419.949 376 406.486 376 392C376 343.398 336.602 304 288 304C280.51 304 273.357 305.221 266.414 306.982L188.094 186.891C180.875 175.781 166.031 172.687 154.875 179.891C143.781 187.141 140.656 202.016 147.906 213.109L224.779 330.98C209.5 346.809 200 368.262 200 392C200 406.486 203.834 419.949 210.035 432H75.75C57.5 397.625 48 359.125 48 320C48 187.625 155.625 80 288 80S528 187.625 528 320C528 359.125 518.5 397.625 500.25 432Z"
            />
          </svg>
        </template>
      </FormInput>

      <FormInput
        label="Notes"
        wrapperClass="sm:col-span-3"
        type="textarea"
        v-model="expense.notes"
      />
    </div>
  </FormDialog>
</template>
