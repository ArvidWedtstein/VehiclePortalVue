<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { ref, toRef } from 'vue';
import FormInput from '@/components/general/form/FormInput.vue';
import FormDialog from '@/components/general/modal/FormDialog.vue';
import type { TablesInsert, TablesUpdate } from '@/database.types';
import { useServicesStore } from '@/stores/services';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/lib/toastManager';

const modalRef = ref();

const vehiclesStore = useVehiclesStore();

const serviceStore = useServicesStore();
const services = toRef(serviceStore, 'services');
const { upsertService } = serviceStore;

const currentVehicle = toRef(vehiclesStore, 'currentVehicle');

const defaultValues: TablesUpdate<'VehicleServiceLogs'> = {
  vehicle_id: currentVehicle.value?.id,
  date: new Date().toISOString().split('.')[0].slice(0, -3),
  provider: '',
  cost: 0,
  currency: 'NOK',
  mileage: 0,
  notes: '',
  type: '',
};

const service = ref<
  TablesInsert<'VehicleServiceLogs'> | TablesUpdate<'VehicleServiceLogs'>
>({ ...defaultValues });

const onFormSubmit = () => {
  console.log('submit', service.value);

  upsertService(service.value);

  toast.triggerToast(
    `Successfully ${service.value.id ? 'saved' : 'created'} service`,
    'success',
    2000,
  );
};

const handleOpen = async (
  service_id: TablesUpdate<'VehicleServiceLogs'>['id'],
) => {
  if (service_id == null || service_id === undefined) {
    const { data, error } = await supabase.rpc('get_last_mileage', {
      vehicle_id: currentVehicle.value?.id || -1,
      type: 'services',
    });

    if (error) throw error;

    const [{ mileage }] = data;

    service.value = { ...defaultValues, mileage };
    modalRef.value?.modalRef?.showModal();
    return;
  }

  const editService = services.value.find(({ id }) => id === service_id);

  if (!editService) {
    alert('No Service found');
    return;
  }

  service.value = {
    ...defaultValues,
    ...editService,
    date: new Date(editService.date || '')
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
    id="serviceModal"
    ref="modalRef"
    :title="service.id ? 'Edit Service' : 'Create Service'"
    @submit="onFormSubmit"
  >
    <div class="my-2 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-6">
      <FormInput
        wrapperClass="md:col-span-2"
        label="Date"
        type="datetime-local"
        v-model="service.date"
        required
      />

      <FormInput
        wrapperClass="md:col-span-2"
        label="Type"
        type="text"
        v-model="service.type"
        required
      />

      <FormInput
        wrapperClass="md:col-span-2"
        label="Provider"
        type="text"
        v-model.trim="service.provider"
      />

      <FormInput
        wrapperClass="md:col-span-2"
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
        wrapperClass="md:col-span-2"
        type="number"
        join
        v-model="service.mileage"
      />

      <FormInput
        label="Notes"
        wrapperClass="md:col-span-2"
        type="textarea"
        v-model="service.notes"
      />
    </div>
  </FormDialog>
</template>
