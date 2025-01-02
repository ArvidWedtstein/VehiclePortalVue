<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { reactive, ref, toRef } from 'vue';
import FormInput from '@/components/general/form/FormInput.vue';
import FormDialog from '@/components/general/modal/FormDialog.vue';
import CheckboxTile from '@/components/general/form/CheckboxTile.vue';

import {
  type Tables,
  type TablesInsert,
  type TablesUpdate,
} from '@/database.types';
import InputHelperTip from '@/components/general/form/InputHelperTip.vue';
import DrivetrainIcon from '@/assets/icons/DrivetrainIcon.vue';
import FormStepper from '@/components/general/form/FormStepper.vue';
import { useToastStore } from '@/stores/general/toasts';
import { useVehicleManufacturersStore } from '@/stores/vehicleManufacturers';
import DataList from '@/components/general/form/DataList.vue';
import { decodeVIN } from '@/utils/vinCountryCodes';

const modalRef = ref();

const { addToast } = useToastStore();

const defaultValues: TablesUpdate<'Vehicles'> = {
  make: undefined,
  model: undefined,
  model_year: undefined,
  type: 'Car',
  body_type: '',
  color: '',
  engine_displacement: undefined,
  engine_displacement_unit: 'liter',
  engine_cylinders: undefined,
  drivetrain: 'FWD',
  eu_control_date: undefined,
  licenseplate_number: '',
  vehicle_identification_number: '',
  weight: 0,
  transmission_gears: undefined,
  fuel_type: undefined,
  fuel_capacity: 0,
  fuel_capacity_unit: 'liter',
  mileage_unit: 'kilometer',
  transmission_type: 'automatic',
};

const vehiclesStore = useVehiclesStore();
const vehicleManufacturersStore = useVehicleManufacturersStore();

const vehicles = toRef(vehiclesStore, 'vehicles');
const { upsertVehicle } = vehiclesStore;

const vehicleManufacturers = toRef(
  vehicleManufacturersStore,
  'vehicleManufacturers',
);

const vehicle = ref<TablesInsert<'Vehicles'> | TablesUpdate<'Vehicles'>>({
  ...defaultValues,
});

const stepControl = reactive({
  step: 0,
  steps: ['General', 'Engine', 'Transmission'],
});

const changeStep = (stepIndex: number) => {
  stepControl.step = Math.max(
    0,
    Math.min(stepControl.steps.length - 1, stepIndex),
  );
};

const onFormSubmit = async () => {
  try {
    await upsertVehicle(vehicle.value);

    modalRef.value.modalRef.close();

    addToast(
      `Successfully ${vehicle.value.id ? 'updated' : 'created'} vehicle`,
      'success',
      2000,
    );
  } catch (err) {
    console.error(err);

    addToast(`Something went wrong.${err}`, 'error', 5000);
  }
};

const handleOpen = (vehicle_id?: Tables<'Vehicles'>['id']) => {
  stepControl.step = 0;

  if (vehicle_id == null || vehicle_id === undefined) {
    vehicle.value = {
      ...defaultValues,
    };

    modalRef.value.modalRef.showModal();
    return;
  }

  const editVehicle = vehicles.value.find(({ id }) => id === vehicle_id);

  if (!editVehicle) {
    alert('No vehicle found');
    return;
  }

  vehicle.value = {
    ...defaultValues,
    ...editVehicle,
  };

  modalRef.value.modalRef.showModal();
};

const handleVIN = () => {
  const vin = vehicle.value.vehicle_identification_number;

  if (!vin) {
    return;
  }

  const decodedVIN = decodeVIN(vin);

  if (!decodedVIN) {
    return;
  }

  vehicle.value.make = decodedVIN.manufacturer;
  vehicle.value.model_year = decodedVIN.modelYear;

  getModels();
};

const availableModels = ref<Array<string>>([]);

const getModels = async () => {
  try {
    if (!vehicle.value.make) return;

    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${vehicle.value.make.replace('Š', 'S')}?format=json`,
    );

    if (!res.ok || res.status !== 200) return;

    const json = await res.json();

    const { Results } = json as {
      Results: { Model_Name: string }[];
    };

    availableModels.value = Results.map(p => p.Model_Name);
  } catch (error) {
    console.error(error);
  }
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
    <FormStepper
      class="my-2"
      v-model="stepControl.step"
      :steps="stepControl.steps"
    >
      <template #step-general>
        <div
          class="my-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 flex-1"
        >
          <FormInput
            wrapperClass="sm:col-span-2"
            label="Liscense Plate Number"
            type="text"
            v-model="vehicle.licenseplate_number"
            placeholder="AB 123456"
            autofocus
          />

          <FormInput
            wrapperClass="sm:col-span-2"
            label="VIN (Vehicle Identification Number)"
            type="text"
            v-model.trim="vehicle.vehicle_identification_number"
            maxlength="17"
            @blur="handleVIN"
          >
            <template #label="{ label }">
              <div class="label">
                <span class="label-text">{{ label }}</span>
                <InputHelperTip
                  position="left"
                  tip="Can usually be found on dashboard, driver's side door and registration certificate"
                />
              </div>
            </template>
          </FormInput>

          <FormInput
            wrapperClass="sm:col-span-2"
            label="Type"
            type="select"
            v-model="vehicle.type"
            :options="[
              { value: 'Car' },
              { value: 'Tractor' },
              { value: 'Motorcycle' },
              { value: 'Trailer' },
              { value: 'Truck' },
              { value: 'Bus' },
              { value: 'Other' },
            ]"
          />

          <FormInput
            label="Make"
            type="text"
            wrapperClass="sm:col-span-2"
            v-model="vehicle.make"
            list="vehicle_makes"
            autocapitalize="words"
            @blur="getModels"
          />

          <DataList
            id="vehicle_makes"
            :options="vehicleManufacturers.map(({ name }) => name)"
          ></DataList>

          <FormInput
            wrapperClass="sm:col-span-2"
            label="Model"
            type="text"
            list="vehicle_models"
            v-model="vehicle.model"
          />

          <DataList id="vehicle_models" :options="availableModels"></DataList>

          <FormInput
            wrapperClass="sm:col-span-2"
            label="Model Year"
            type="number"
            inputmode="decimal"
            step="1"
            :min="1885"
            v-model="vehicle.model_year"
          />
        </div>
      </template>
      <template #step-engine>
        <div
          class="mt-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 flex-1"
        >
          <FormInput
            wrapperClass="sm:col-span-2"
            label="Fuel Type"
            type="select"
            v-model="vehicle.fuel_type"
            :options="[
              {
                value: 'Gasoline',
              },
              {
                value: 'Diesel',
              },
              {
                value: 'Kerosene',
              },
              {
                value: 'Gas',
              },
              {
                value: 'Electric',
              },
              {
                value: 'Hydrogen',
              },
              {
                value: 'Other',
              },
              {
                value: 'Biodiesel',
              },
              {
                value: 'Biogasoline',
              },
              {
                value: 'LPG-gas',
              },
              {
                value: 'CNG-gas',
              },
              {
                value: 'Metanol',
              },
              {
                value: 'Etanol',
              },
              {
                value: 'LPG-A',
              },
              {
                value: 'LPG-B',
              },
              {
                value: 'CNG 20',
              },
              {
                value: 'CNG 25',
              },
            ]"
          />

          <FormInput
            wrapperClass="sm:col-span-3"
            label="Fuel Capacity"
            type="number"
            inputmode="decimal"
            v-model="vehicle.fuel_capacity"
            join
          >
            <template #addon>
              <FormInput
                wrapperClass="max-w-28"
                class="join-item max-w-full"
                type="select"
                v-model="vehicle.fuel_capacity_unit"
                :options="[
                  { value: 'liter', label: 'Liter' },
                  { value: 'gallon', label: 'US Gallon' },
                  { value: 'imp_gallon', label: 'Imperial Gallon' },
                ]"
              />
            </template>
          </FormInput>

          <FormInput
            wrapperClass="sm:col-span-2"
            class="sm:max-w-32"
            label="Engine Displacement"
            type="text"
            inputmode="decimal"
            v-model="vehicle.engine_displacement"
            join
          >
            <template #addon>
              <FormInput
                class="join-item max-w-fit"
                type="select"
                v-model="vehicle.engine_displacement_unit"
                :options="[
                  { value: 'liter', label: 'Liter' },
                  { value: 'cubic-centimeter', label: 'Cubic Centimeter' },
                  { value: 'cubic-inch', label: 'Cubic Inch' },
                ]"
              />
            </template>
          </FormInput>

          <FormInput
            wrapperClass="sm:col-span-2"
            label="Cylinders"
            type="number"
            :min="0"
            v-model="vehicle.engine_cylinders"
          />

          <FormInput
            wrapperClass="sm:col-span-2"
            label="Mileage Unit"
            type="select"
            v-model="vehicle.mileage_unit"
            :options="[
              { value: 'kilometer', label: 'Kilometer' },
              { value: 'mile', label: 'Mile' },
              { value: 'yards', label: 'Yards' },
              { value: 'feet', label: 'Feet' },
            ]"
            helpText="The unit in which the mileage is measured"
          />
        </div>
      </template>
      <template #step-transmission>
        <div
          class="mt-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 flex-1"
        >
          <FormInput
            wrapperClass="sm:col-span-2"
            label="Type"
            type="select"
            v-model="vehicle.transmission_type"
            :options="[
              { value: 'manual', label: 'Manual' },
              { value: 'automatic', label: 'Automatic' },
            ]"
          />

          <FormInput
            wrapperClass="sm:col-span-2"
            label="Gears"
            type="number"
            inputmode="decimal"
            v-model="vehicle.transmission_gears"
          />

          <div class="form-control">
            <label class="label">
              <span class="label-text">Drivetrain</span>
            </label>

            <div class="flex gap-2">
              <CheckboxTile
                v-model="vehicle.drivetrain"
                value="FWD"
                type="radio"
                name="drivetrain"
              >
                <template #icon>
                  <DrivetrainIcon class="w-6 fill-current" drivetrain="FWD" />
                </template>
              </CheckboxTile>
              <CheckboxTile
                v-model="vehicle.drivetrain"
                value="RWD"
                type="radio"
                name="drivetrain"
              >
                <template #icon>
                  <DrivetrainIcon class="w-6 fill-current" drivetrain="RWD" />
                </template>
              </CheckboxTile>
              <CheckboxTile
                v-model="vehicle.drivetrain"
                label="AWD"
                value="AWD"
                type="radio"
                name="drivetrain"
              >
                <template #icon>
                  <DrivetrainIcon class="w-6 fill-current" drivetrain="AWD" />
                </template>
              </CheckboxTile>
            </div>
          </div>
        </div>
      </template>
    </FormStepper>

    <template #actions>
      <button
        type="button"
        class="btn btn-outline"
        @click="changeStep(stepControl.step - 1)"
        :disabled="stepControl.step === 0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          class="w-2 fill-current"
        >
          <path
            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
          />
        </svg>
        Back
      </button>
      <button
        v-if="stepControl.step < stepControl.steps.length - 1"
        type="button"
        class="btn btn-outline"
        @click="changeStep(stepControl.step + 1)"
      >
        Next
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          class="w-2 fill-current"
        >
          <path
            d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
          />
        </svg>
      </button>

      <button
        v-if="stepControl.step === stepControl.steps.length - 1"
        type="button"
        @click="onFormSubmit"
        class="btn btn-primary ms-1"
        :disabled="stepControl.step !== stepControl.steps.length - 1"
      >
        {{ vehicle.id ? 'Save' : 'Create' }}
      </button>
    </template>
  </FormDialog>
</template>
