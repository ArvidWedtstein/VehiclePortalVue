<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { onMounted, ref } from 'vue';
import FormInput from '@/components/general/form/FormInput.vue';
import FormDialog from '@/components/general/modal/FormDialog.vue';

import { type Tables, type TablesInsert, type TablesUpdate } from '@/database.types';

// type VehicleFormData = Omit<Vehicle, 'id'> & { id: null | number };
type Props = {
  vehicle_id?: Tables<"Vehicles">["id"];
};
const props = withDefaults(defineProps<Props>(), {
  vehicle_id: undefined,
});

const defaultValues: TablesUpdate<"Vehicles"> = {
  ...(props.vehicle_id ? { id: props.vehicle_id } : {}),
  created_at: new Date().toISOString(),
  createdby_id: '',
  name: '',
  make: '',
  model: '',
  type: '',
  body_type: '',
  color: '',
  drivetrain: '',
  eu_control_date: '',
  registered_date: '',
  licenseplate_number: '',
  vehicle_identification_number: '',
  weight: 0,
  height: '',
  length: '',
  width: '',
  fuel_capacity: 0,
  engine_id: undefined,
  transmission_id: undefined,
  mileage_unit: 'kilometer',
};

const { vehicles } = useVehiclesStore();

const vehicle = ref<TablesInsert<"Vehicles"> | TablesUpdate<"Vehicles">>({ ...defaultValues });

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
        v-model="vehicle.licenseplate_number"
        mask="AA-######"
        placeholder="AB 123456"
        required
      />

      <FormInput
        wrapperClass="sm:col-span-4"
        label="VIN (Vehicle Identification Number)"
        type="text"
        v-model="vehicle.vehicle_identification_number"
      />

      
      <FormInput
        wrapperClass="sm:col-span-2"
        label="Make"
        type="text"
        v-model="vehicle.make"
      />

      <FormInput
        wrapperClass="sm:col-span-2"
        label="Model"
        type="text"
        v-model="vehicle.model"
      />

      <FormInput
        wrapperClass="sm:col-span-2"
        label="Registered Date"
        type="date"
        v-model="vehicle.registered_date"
      />
    </div>
  </FormDialog>
</template>
