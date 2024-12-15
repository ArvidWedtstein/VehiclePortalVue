<script setup lang="ts">
import { ref, toRef } from 'vue';
import FormDialog from '@/components/general/modal/FormDialog.vue';
import type { Tables } from '@/database.types';
import { useServicesStore } from '@/stores/services';
import { toast } from '@/lib/toastManager';
import ListGroupItem from '@/components/general/list/ListGroupItem.vue';
import ListGroup from '@/components/general/list/ListGroup.vue';
import { formatDate } from '@/utils/date';
import { useDocumentsStore } from '@/stores/documents';
import type { iFile } from '@/components/general/file/FileDrop.vue';

const modalRef = ref();

const serviceStore = useServicesStore();
const { bindDocumentToService } = useDocumentsStore();
const services = toRef(serviceStore, 'services');

const { getServices } = serviceStore;

const selectedService = ref<Tables<'VehicleServiceLogs'> | null>(null);

const currentFile = ref<Partial<iFile>>();

const onFormSubmit = async () => {
  if (!selectedService.value || !currentFile.value || !currentFile.value.path)
    return;

  try {
    await bindDocumentToService(
      currentFile.value.path,
      selectedService.value.id,
    );
  } catch (error) {
    toast.triggerToast(
      `Something went wrong while binding file to service\n${error}`,
      'error',
      2000,
    );
  } finally {
    toast.triggerToast(`Successfully bound file to service`, 'success', 2000);
  }
};

const handleOpen = async (file: Partial<iFile>) => {
  selectedService.value = null;

  if (!services.value.length) {
    await getServices();
  }

  currentFile.value = file;

  modalRef.value.modalRef.showModal();
};

const checkService = (service: Tables<'VehicleServiceLogs'>) => {
  console.log('check service', service);
  selectedService.value = service;
};

defineExpose({ modalRef: modalRef, open: handleOpen });
</script>

<template>
  <FormDialog
    id="bindFileToServiceModal"
    ref="modalRef"
    title="Bind File to service"
    @submit="onFormSubmit"
  >
    <ListGroup class="max-h-96 mt-2">
      <ListGroupItem
        v-for="(service, serviceIndex) in services"
        :key="serviceIndex"
        as="button"
        size="sm"
        :title="service.type || ''"
        :subtitle="formatDate(service.date, { dateStyle: 'long' })"
        :class="{ active: selectedService?.id === service.id }"
        @click="checkService(service)"
      >
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            class="fill-current w-3 mx-4"
            :class="{ hidden: selectedService?.id !== service.id }"
          >
            <path
              d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
            />
          </svg>
        </template>
      </ListGroupItem>
    </ListGroup>
  </FormDialog>
</template>
