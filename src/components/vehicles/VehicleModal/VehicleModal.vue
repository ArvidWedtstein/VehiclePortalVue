<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { onMounted, ref } from 'vue';
import FormInput from '@/components/general/form/FormInput.vue';
import FormDialog from '@/components/general/modal/FormDialog.vue';

import { type Vehicle } from '@/types';

type VehicleFormData = Omit<Vehicle, 'id'> & { id: null | number };
type Props = {
  vehicle_id?: Vehicle['id'] | null;
};
const props = withDefaults(defineProps<Props>(), {
  vehicle_id: null,
});

const defaultValues: VehicleFormData = {
  id: props.vehicle_id,
  created_at: new Date().toISOString(),
  createdby_id: '',
  name: '',
  make: '',
  model: null,
  type: '',
  body_type: '',
  manufacturer: '',
  drivetrain: '',
  eu_control_date: '',
  registered_date: '',
  register_number: '',
  vehicle_identification_number: '',
  weight: 0,
  height: '',
  length: '',
  width: '',
  imageUrl: '',
  fuel_capacity: 0,
  engine_id: undefined,
  transmission_id: undefined,
  odometer_unit: 'kilometer',
};

const { vehicles } = useVehiclesStore();

const vehicle = ref<VehicleFormData>({ ...defaultValues });

const onModalOpen = () => {
  vehicle.value = { ...defaultValues };

  console.log('open', vehicle.value, defaultValues);
};

const onFormSubmit = () => {
  console.log('submit', vehicle.value);
};

onMounted(() => {
  const editVehicle = vehicles.find(({ id }) => id === props.vehicle_id);

  if (!editVehicle) return;
  vehicle.value = editVehicle;
});
</script>

<template>
  <FormDialog
    id="vehicleModal"
    ref="modalRef"
    :title="vehicle_id ? 'Edit Vehicle' : 'Add Vehicle'"
    @open="onModalOpen"
    @submit="onFormSubmit"
  >
    <div class="mt-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
      <FormInput
        wrapperClass="sm:col-span-2"
        label="Register Number"
        type="text"
        v-model="vehicle.register_number"
        mask="(###) ###-####"
        required
      />
    </div>
  </FormDialog>
</template>
