<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { onMounted, ref } from 'vue';
import FormInput from '@/components/general/form/FormInput.vue';
import FormDialog from '@/components/general/modal/FormDialog.vue';
import { type Service } from '@/stores/types';

const modalRef = ref<InstanceType<typeof HTMLDialogElement> | null>(null);
const { services } = useVehiclesStore();

const props = defineProps({
  vehicle_id: {
    type: Number,
    required: true,
  },
  service_id: {
    type: Number,
    required: false,
  },
});

const defaultValues: Service = {
  id: null,
  created_at: new Date().toISOString(),
  createdby_id: '',
  vehicle_id: props.vehicle_id,
  service_date: new Date().toISOString().split('.')[0].slice(0, -3),
  service_provider: '',
  cost: 0,
  currency: 'NOK',
  notes: '',
  type: '',
};

const service = ref<Service>({ ...defaultValues });

const onModalOpen = () => {
  service.value = { ...defaultValues };

  console.log('open', service.value, defaultValues);
};

const onFormSubmit = () => {
  console.log('submit', service.value);
};

onMounted(() => {
  if (!props.service_id) return;

  const editService = services.find(({ id }) => id === props.service_id);

  if (!editService) return;
  service.value = editService;
});
</script>

<template>
  <FormDialog
    id="serviceModal"
    ref="modalRef"
    :title="service_id ? 'Edit Service' : 'Create Service'"
    @open="onModalOpen"
    @submit="onFormSubmit"
  >
    <div class="mt-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
      <FormInput
        wrapperClass="sm:col-span-2"
        label="Date"
        type="datetime-local"
        v-model="service.service_date"
        required
      />

      <FormInput
        wrapperClass="sm:col-span-2"
        label="Type"
        type="text"
        v-model="service.type"
        required
      />

      <FormInput
        wrapperClass="sm:col-span-2"
        label="Provider"
        type="text"
        v-model.trim="service.service_provider"
        required
      />

      <FormInput
        wrapperClass="sm:col-span-2"
        label="Cost"
        type="number"
        join
        v-model.number="service.cost"
      >
        <template #addon>
          <FormInput
            class="join-item w-10"
            type="select"
            v-model="service.currency"
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
        wrapperClass="sm:col-span-2"
        type="number"
        join
        v-model="service.odometer_reading"
      />

      <FormInput
        label="Notes"
        wrapperClass="sm:col-span-2"
        type="textarea"
        v-model="service.notes"
      />
    </div>
  </FormDialog>
</template>
