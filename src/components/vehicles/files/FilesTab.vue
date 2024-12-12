<script setup lang="ts">
import CropperModal from '@/components/general/file/CropperModal.vue';
import FileDrop from '@/components/general/file/FileDrop.vue';
import { useDocumentsStore } from '@/stores/documents';
import { useVehiclesStore } from '@/stores/vehicles';
import { onMounted, ref, toRef, toRefs } from 'vue';

const vehicleStore = useVehiclesStore();
const documentsStore = useDocumentsStore();

const cropperModal = ref();
const currentVehicle = toRef(vehicleStore, 'currentVehicle');
const { documents } = toRefs(documentsStore);
const { getDocuments } = documentsStore;

onMounted(() => {
  getDocuments();
});

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    if (reader.result) {
      cropperModal.value.open(reader.result as string);
    }
  };

  reader.readAsDataURL(file);
};
</script>

<template>
  <div v-if="currentVehicle">
    <FileDrop
      bucket="VehicleDocuments"
      :storagePath="`${currentVehicle.licenseplate_number}/`"
      :initialFiles="
        documents.map(({ name, file_path, file_size }) => ({
          file: { name: name || '', size: file_size || 0 },
          path: file_path,
          state: 'uploaded',
        }))
      "
    />
    <input
      type="file"
      accept="image/*"
      ref="fileInput"
      @change="handleImageUpload"
      class="file-input file-input-bordered w-full max-w-xs"
    />

    <CropperModal ref="cropperModal" />
  </div>
</template>
