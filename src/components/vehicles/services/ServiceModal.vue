<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { computed, reactive, ref, toRef } from 'vue';
import FormInput from '@/components/general/form/FormInput.vue';
import FormDialog from '@/components/general/modal/FormDialog.vue';
import type { TablesInsert, TablesUpdate } from '@/database.types';
import { useServicesStore } from '@/stores/services';
import { supabase } from '@/lib/supabaseClient';
import { formatNumber } from '@/utils/format';
import { convertToDatetimeLocal, getLocalDateISO } from '@/utils/date';
import { useToastStore } from '@/stores/toasts';
import DataList from '@/components/general/form/DataList.vue';
import FormStepper from '@/components/general/form/FormStepper.vue';
import FileDrop from '@/components/general/file/FileDrop.vue';
import { useDocumentsStore } from '@/stores/documents';

const modalRef = ref();

const { addToast } = useToastStore();

const vehiclesStore = useVehiclesStore();
const currentVehicle = toRef(vehiclesStore, 'currentVehicle');

const documentsStore = useDocumentsStore();
const documents = toRef(documentsStore, 'documents');

const serviceStore = useServicesStore();
const services = toRef(serviceStore, 'services');
const { upsertService } = serviceStore;

const stepControl = reactive({
  step: 0,
  steps: ['Service', 'Files'],
});

const changeStep = (stepIndex: number) => {
  stepControl.step = Math.max(
    0,
    Math.min(stepControl.steps.length - 1, stepIndex),
  );
};

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

const onFormSubmit = async () => {
  try {
    await upsertService({
      ...service.value,
      date:
        service.value.date +
        `+${Math.abs(new Date().getTimezoneOffset() / 60)}`,
    });

    addToast(
      `Successfully ${service.value.id ? 'saved' : 'created'} service`,
      'success',
      2000,
    );
  } catch (error) {
    addToast(`Something went wrong. ${error}`, 'error', 5000);
  }
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
    date: convertToDatetimeLocal(editService.date),
  };

  modalRef.value.modalRef.showModal();
};

const serviceFiles = computed(() =>
  documents.value
    .filter(({ service_log_id }) => service_log_id === service.value.id)
    .map(({ name, file_path, file_size }) => ({
      file: { name: name || '', size: file_size || 0 },
      path: file_path,
    })),
);

defineExpose({ modalRef: modalRef, open: handleOpen });
</script>

<template>
  <FormDialog
    id="serviceModal"
    ref="modalRef"
    :title="service.id ? 'Edit Service' : 'Create Service'"
    @submit="onFormSubmit"
  >
    <FormStepper
      class="my-2"
      v-model="stepControl.step"
      :steps="stepControl.steps"
    >
      <template #step-service>
        <div
          class="mt-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 flex-1"
        >
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
          />

          <DataList
            id="service_types"
            :options="[
              'Oil Change',
              'Timing belt',
              'Timing Chain',
              'Brake Pads',
            ]"
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
            :min="0"
          >
            <template #addon>
              <FormInput
                class="join-item w-10"
                type="select"
                v-model="service.currency"
                :options="[
                  { value: 'NOK' },
                  { value: 'EUR' },
                  { value: 'GBP' },
                  { value: 'USD' },
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
            :min="0"
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
      </template>
      <template #step-files>
        <FileDrop
          class="w-full mt-2"
          bucket="VehicleDocuments"
          :storagePath="`${currentVehicle?.licenseplate_number}/`"
          multiple
          :initialFiles="serviceFiles"
        />
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
        type="button"
        class="btn btn-outline"
        @click="changeStep(stepControl.step + 1)"
        :disabled="stepControl.step === stepControl.steps.length - 1"
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

      <button type="button" @click="onFormSubmit" class="btn btn-primary ms-1">
        {{ service.id ? 'Save' : 'Create' }}
      </button>
    </template>
  </FormDialog>
</template>
