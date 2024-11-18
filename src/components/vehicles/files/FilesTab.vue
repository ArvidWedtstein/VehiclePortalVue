<script setup lang="ts">
import FileDrop from '@/components/general/form/FileDrop.vue';
import { useDocumentsStore } from '@/stores/documents';
import { useVehiclesStore } from '@/stores/vehicles';
import { onMounted, ref, toRef, toRefs } from 'vue';

const vehicleStore = useVehiclesStore();
const documentsStore = useDocumentsStore();

const currentVehicle = toRef(vehicleStore, 'currentVehicle');
const { documents } = toRefs(documentsStore);
const { getDocuments } = documentsStore;

onMounted(() => {
  getDocuments();
});
console.log(documents.value);

const mappedDocuments = ref(
  documents.value.map(document => ({
    url: document.signedUrl,
    file: { name: document.name || '' },
    error: undefined,
  })),
);
</script>

<template>
  <div>
    <FileDrop
      :storagePath="`VehicleDocuments/${currentVehicle?.licenseplate_number}/`"
      v-model="mappedDocuments"
    />
    <ul class="menu w-full">
      <li v-for="document in documents" :key="document.id">
        <a>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-4 w-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          {{ document.name }}
        </a>
      </li>
    </ul>
  </div>
</template>
