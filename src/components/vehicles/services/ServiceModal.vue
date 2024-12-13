<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { ref, toRef } from 'vue';
import FormInput from '@/components/general/form/FormInput.vue';
import FormDialog from '@/components/general/modal/FormDialog.vue';
import type { TablesInsert, TablesUpdate } from '@/database.types';
import { useServicesStore } from '@/stores/services';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/lib/toastManager';
import { formatNumber } from '@/utils/format';
import DataList from '@/components/general/form/DataList.vue';
import { getLocalDateISO } from '@/utils/date';

const modalRef = ref();

const vehiclesStore = useVehiclesStore();

const serviceStore = useServicesStore();
const services = toRef(serviceStore, 'services');
const { upsertService } = serviceStore;

const currentVehicle = toRef(vehiclesStore, 'currentVehicle');

const defaultValues: TablesUpdate<'VehicleServiceLogs'> = {
  vehicle_id: currentVehicle.value?.id,
  date: new Date().toUTCString().split('.')[0].slice(0, -3),
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

  upsertService({
    ...service.value,
    date:
      service.value.date + `+${Math.abs(new Date().getTimezoneOffset() / 60)}`,
  });

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
    if (!currentVehicle.value) return;

    const { data, error } = await supabase.rpc('get_last_mileage', {
      vehicle_id: currentVehicle.value.id,
      type: 'services',
    });

    if (error) throw error;

    const [{ mileage }] = data;

    service.value = {
      ...defaultValues,
      date: getLocalDateISO().split('.')[0].slice(0, -3),
      mileage,
    };

    console.log(new Date().getTimezoneOffset());
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
        list="service_types"
        required
      />

      <DataList id="service_types" :options="['Oil Change', 'Registerreim']" />

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
        type="text"
        inputmode="decimal"
        v-model="service.mileage"
      >
        <template #addon>
          <span class="absolute right-0 pr-3">
            {{
              formatNumber(0, {
                style: 'unit',
                unit: currentVehicle?.mileage_unit || 'kilometer',
              }).replace('0', '')
            }}
          </span>
        </template>
      </FormInput>

      <FormInput
        label="Notes"
        wrapperClass="md:col-span-2"
        type="textarea"
        rows="1"
        v-model="service.notes"
      />
    </div>
  </FormDialog>
</template>
