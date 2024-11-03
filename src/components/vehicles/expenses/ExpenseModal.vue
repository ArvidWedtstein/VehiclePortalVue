<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { onMounted, ref } from 'vue';
import FormInput from '@/components/general/form/FormInput.vue';
import FormDialog from '@/components/general/modal/FormDialog.vue';

import type { TablesInsert, TablesUpdate } from '@/database.types';

const props = defineProps({
  vehicle_id: {
    type: Number,
    required: true,
  },
  expense_id: {
    type: Number,
    required: false,
  },
});

// TODO: auto-suggest last odometer reading

const modalRef = ref<InstanceType<typeof HTMLDialogElement> | null>(null);
const { expenses } = useVehiclesStore();

const defaultValues: TablesUpdate<"VehicleExpenses"> = {
  ...(props.expense_id ? { id: props.expense_id } : {}),
  created_at: new Date().toISOString(),
  createdby_id: '',
  vehicle_id: props.vehicle_id,
  expense_date: new Date().toISOString().split('.')[0].slice(0, -3),
  expense_type: '',
  amount: 0,
  notes: '',
  cost: 0,
  currency: 'NOK',
  unit: 'liter',
};

const expense = ref<TablesInsert<"VehicleExpenses"> | TablesUpdate<"VehicleExpenses">>({ ...defaultValues });

const onModalOpen = () => {
  expense.value = { ...defaultValues };

  console.log('open', expense.value, defaultValues);
};

const onFormSubmit = () => {
  console.log('submit', expense.value);
};

onMounted(() => {
  if (!props.expense_id) return;

  const editExpense = expenses.find(({ id }) => id === props.expense_id);

  if (!editExpense) return;
  expense.value = editExpense;
});
</script>

<template>
  <FormDialog
    id="expenseModal"
    ref="modalRef"
    :title="expense_id ? 'Edit Expense' : 'Create Expense'"
    @open="onModalOpen"
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
      >
        <option disabled selected>Select a type</option>
        <option value="diesel">Diesel</option>
        <option value="gasoline98">Gasoline 98</option>
        <option value="gasoline95">Gasoline 95</option>
      </FormInput>

      <FormInput
        wrapperClass="sm:col-span-3"
        label="Amount"
        type="number"
        join
        v-model.number="expense.amount"
      >
        <template #addon>
          <FormInput class="join-item" type="select" v-model="expense.unit">
            <option disabled selected>Select a unit</option>
            <option value="liter">Liter</option>
            <option value="gallon">Gallon</option>
          </FormInput>
        </template>
      </FormInput>

      <FormInput
        wrapperClass="sm:col-span-3"
        label="Cost"
        type="number"
        join
        v-model.number="expense.cost"
      >
        <template #addon>
          <FormInput
            class="join-item w-10"
            type="select"
            v-model="expense.currency"
          >
            <option disabled selected>Select a currency</option>
            <option value="NOK">NOK</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="SEK">SEK</option>
            <option value="DDK">DDK</option>
          </FormInput>
        </template>
      </FormInput>

      <FormInput
        label="Odometer Reading"
        wrapperClass="sm:col-span-3"
        type="text"
        inputmode="numeric"
        placeholder="0 000 000"
        v-model="expense.mileage"
      />

      <FormInput
        label="Notes"
        wrapperClass="sm:col-span-3"
        type="textarea"
        v-model="expense.notes"
      />
    </div>
  </FormDialog>
</template>
