<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { ref, toRef } from 'vue';
import FormInput from '@/components/general/form/FormInput.vue';
import FormDialog from '@/components/general/modal/FormDialog.vue';
import CheckboxTile from '@/components/general/form/CheckboxTile.vue';

import { type TablesInsert, type TablesUpdate } from '@/database.types';

const step = ref(0);

const modalRef = ref();

const defaultValues: TablesUpdate<'Vehicles'> = {
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

const vehiclesStore = useVehiclesStore();

const vehicles = toRef(vehiclesStore, 'vehicles');

const vehicle = ref<TablesInsert<'Vehicles'> | TablesUpdate<'Vehicles'>>({
  ...defaultValues,
});

const changeStep = (stepIndex: number) => {
  step.value = Math.max(0, Math.min(3, stepIndex));
};

const onFormSubmit = () => {
  console.log('submit', vehicle.value);

  // upsertVehicle({
  //   id: 7,
  //   name: 'TEST',
  //   make: 'TEST',
  //   model: 'TEST',
  //   type: 'AAAAAAAA',
  //   body_type: 'AAAAAAAA',
  //   color: 'BLAAACK',
  //   drivetrain: 'NWD',
  //   licenseplate_number: 'AA 12345',
  //   mileage_unit: 'kilometer',
  // });
};

const handleOpen = (vehicle_id: TablesUpdate<'Vehicles'>['id']) => {
  console.log('open', vehicle_id);

  if (vehicle_id == null || vehicle_id === undefined) {
    modalRef.value.modalRef.showModal();
    return;
  }

  const editVehicle = vehicles.value.find(({ id }) => id === vehicle_id);

  if (!editVehicle) {
    alert('No vehicle found');
    return;
  }

  console.log({
    ...defaultValues,
    ...editVehicle,
  });

  vehicle.value = {
    ...defaultValues,
    ...editVehicle,
  };

  modalRef.value.modalRef.showModal();
};

defineExpose({ modalRef: modalRef, open: handleOpen });
</script>

<template>
  <FormDialog
    id="vehicleModal"
    ref="modalRef"
    :title="vehicle.id ? 'Edit Vehicle' : 'Add Vehicle'"
    @submit="onFormSubmit"
  >
    <ul class="steps steps-vertical lg:steps-horizontal w-full">
      <li
        data-content="?"
        class="step"
        :class="[step >= 0 ? 'step-primary' : '']"
      >
        <a href="#item1">General Info</a>
      </li>
      <li
        data-content="?"
        class="step"
        :class="[step >= 1 ? 'step-primary' : '']"
      >
        <a href="#item2">Engine</a>
      </li>
      <li
        data-content="✓"
        class="step"
        :class="[step >= 2 ? 'step-primary' : '']"
      >
        <a href="#item3">Transmission</a>
      </li>
    </ul>
    <div class="carousel w-full">
      <div v-if="step === 0" id="item1" class="carousel-item w-full">
        <div class="m-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 flex-1">
          <FormInput
            wrapperClass="sm:col-span-2"
            label="Liscense Number"
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

          <CheckboxTile
            v-model="vehicle.drivetrain"
            value="AWD"
            type="radio"
            name="drivetrain"
            >AWD</CheckboxTile
          >
          <CheckboxTile
            v-model="vehicle.drivetrain"
            value="RWD"
            type="radio"
            name="drivetrain"
            >RWD</CheckboxTile
          >
          <CheckboxTile
            v-model="vehicle.drivetrain"
            value="FWD"
            type="radio"
            name="drivetrain"
            >FWD</CheckboxTile
          >
        </div>
      </div>
      <div v-if="step === 1" id="item2" class="carousel-item w-full">
        <div class="m-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 flex-1">
          <FormInput
            wrapperClass="sm:col-span-2"
            label="Fuel Capacity"
            type="number"
            inputmode="decimal"
            v-model="vehicle.fuel_capacity"
          />

          <FormInput
            wrapperClass="sm:col-span-2"
            label="Engine Size"
            type="text"
            v-model="vehicle.engine_size"
          />
        </div>
      </div>
      <div v-if="step === 2" id="item3" class="carousel-item w-full">
        <div class="m-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 flex-1">
          <FormInput
            wrapperClass="sm:col-span-2"
            label="Type"
            type="select"
            v-model="vehicle.transmission_type"
          >
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </FormInput>

          <FormInput
            wrapperClass="sm:col-span-2"
            label="Gears"
            type="number"
            inputmode="decimal"
            v-model="vehicle.transmission_gears"
          />
        </div>
      </div>
    </div>

    <template #actions>
      <button
        type="button"
        class="btn btn-sm btn-outline"
        @click="changeStep(step - 1)"
        :disabled="step === 0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          fill="currentColor"
          class="w-2"
        >
          <path
            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
          />
        </svg>
      </button>
      <button
        type="button"
        class="btn btn-sm btn-outline"
        @click="changeStep(step + 1)"
        :disabled="step === 2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          fill="currentColor"
          class="w-2"
        >
          <path
            d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
          />
        </svg>
      </button>

      <button
        class="btn btn-sm btn-outline"
        value="cancel"
        formmethod="dialog"
        formnovalidate
      >
        Close
      </button>

      <button
        type="submit"
        class="btn btn-sm btn-primary ms-1"
        value="submit"
        :disabled="step !== 2"
      >
        Create
      </button>
    </template>
  </FormDialog>
</template>
