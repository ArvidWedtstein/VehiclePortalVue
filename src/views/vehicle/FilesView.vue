<script setup lang="ts">
import FileDrop from '@/components/general/file/FileDrop.vue';
import { useDocumentsStore } from '@/stores/documents';
import { useVehiclesStore } from '@/stores/vehicles';
import { onMounted, toRef, toRefs } from 'vue';

const vehicleStore = useVehiclesStore();
const currentVehicle = toRef(vehicleStore, 'currentVehicle');

const documentsStore = useDocumentsStore();
const { documents } = toRefs(documentsStore);
const { getDocuments } = documentsStore;

onMounted(async () => {
  await getDocuments();
});
</script>

<template>
  <div v-if="currentVehicle">
    <FileDrop
      bucket="VehicleDocuments"
      :storagePath="`${currentVehicle.licenseplate_number}/`"
      multiple
      :initialFiles="
        documents.map(({ name, file_path, file_size, service_log_id }) => ({
          file: { name: name || '', size: file_size || 0 },
          path: file_path,
          state: 'uploaded',
          service_log_id,
        }))
      "
    />
  </div>
</template>
