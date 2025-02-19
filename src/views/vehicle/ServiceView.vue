<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { RouterLink, useRoute } from 'vue-router';
import { computed, defineAsyncComponent, onBeforeMount, ref, watch } from 'vue';

import { storeToRefs } from 'pinia';
import { useServicesStore } from '@/stores/services';
import { formatDate } from '@/utils/date';
import { formatNumber } from '@/utils/format';
import { useConfirm } from '@/lib/composables/useConfirm';
import FileGrid from '@/components/general/file/FileGrid.vue';
import { useDocumentsStore } from '@/stores/documents';
import type { iFile } from '@/components/general/file/FileDrop.vue';
import { useToastStore } from '@/stores/general/toasts';
import MenuItem from '@/components/general/menu/MenuItem.vue';
import { supabase } from '@/lib/supabaseClient';
import { downloadBlob } from '@/utils/export';
import EditIcon from '@/assets/icons/EditIcon.vue';
import TrashIcon from '@/assets/icons/TrashIcon.vue';
import ChevronRight from '@/assets/icons/ChevronRight.vue';

const ServiceModal = defineAsyncComponent(
  async () => await import('@/components/vehicles/services/ServiceModal.vue'),
);
const FilePreviewModal = defineAsyncComponent(
  async () => await import('@/components/general/modal/FilePreviewModal.vue'),
);

const vehiclesStore = useVehiclesStore();
const servicesStore = useServicesStore();
const documentsStore = useDocumentsStore();

const { addToast } = useToastStore();

const { currentVehicle } = storeToRefs(vehiclesStore);

const { services, loading } = storeToRefs(servicesStore);
const { getServices, deleteService } = servicesStore;

const { documents } = storeToRefs(documentsStore);
const { deleteDocumentFile } = documentsStore;

const serviceModalRef = ref<InstanceType<typeof ServiceModal>>();
const filePreviewRef = ref<InstanceType<typeof FilePreviewModal>>();

const route = useRoute();

const serviceId = Array.isArray(route.params.id)
  ? parseInt(route.params.id[0])
  : parseInt(route.params.id);

const service = computed(() => {
  const serviceId = Array.isArray(route.params.id)
    ? parseInt(route.params.id[0])
    : parseInt(route.params.id);

  return services.value.filter(({ id }) => id === serviceId)[0];
});

watch(
  () => route.params.id,
  () => getServices({ id: serviceId }),
  {
    immediate: true,
  },
);

const serviceFiles = computed(() =>
  documents.value
    .filter(({ service_log_id }) => service_log_id === service.value.id)
    .map(({ name, file_path, file_size }) => ({
      file: { name: name || '', size: file_size || 0 },
      path: file_path,
    })),
);

const handleServiceDelete = async () => {
  const result = await useConfirm({
    title: 'Delete Service?',
    message:
      'Are you sure you want to delete this service? This cannot be undone.',
    confirmLabel: 'Delete',
    severity: 'danger',
  });

  if (!result) return;

  deleteService(service.value.id);
};

const downloadFile = async (file: Partial<iFile>) => {
  try {
    if (!file.path) return;

    const { data, error } = await supabase.storage
      .from('VehicleDocuments')
      .download(file.path);

    if (error) throw error;

    downloadBlob(data, file.file?.name || 'file');
  } catch (error) {
    console.error(error);
    addToast(`Failed to download file`, 'error', 2000);
  }
};

const handleFileDelete = async (file: Partial<iFile>) => {
  if (!file.path) return;

  await deleteDocumentFile([file.path]);

  addToast(`Successfully deleted file`, 'success', 2000);
};

onBeforeMount(async () => {
  await getServices({ id: serviceId });
});
</script>

<template>
  <ServiceModal ref="serviceModalRef" />
  <FilePreviewModal bucket="VehicleDocuments" ref="filePreviewRef" />

  <RouterLink
    v-if="currentVehicle"
    :to="{ name: 'services' }"
    class="flex gap-2 mb-2"
  >
    <ChevronRight class="w-3" />
    Back to services
  </RouterLink>

  <div
    v-if="!loading && service"
    class="card card-compact md:card-side bg-base-100 shadow-xl"
  >
    <div class="card-body">
      <div class="flex justify-between w-full">
        <h2 class="card-title">{{ service.type }}</h2>

        <div class="flex gap-1">
          <button
            type="button"
            class="btn btn-sm btn-outline btn-neutral"
            @click="serviceModalRef.open(service.id)"
          >
            <EditIcon class="w-3" />
            Edit
          </button>

          <button
            type="button"
            class="btn btn-sm btn-outline btn-error"
            @click="handleServiceDelete"
          >
            <TrashIcon class="w-3" />
            Delete
          </button>
        </div>
      </div>

      <ul class="flex flex-col gap-1 text-sm">
        <li class="inline-flex gap-1 items-center">
          <span class="font-semibold">Date:</span>
          <span>
            {{
              formatDate(service.date, {
                dateStyle: 'long',
                timeStyle: 'short',
              })
            }}
          </span>
        </li>
        <li class="inline-flex gap-1 items-center">
          <span class="font-semibold">Provider:</span>
          <span>
            {{ service.provider }}
          </span>
        </li>
        <li class="inline-flex gap-1 items-center">
          <span class="font-semibold">Mileage:</span>
          <span>
            {{
              formatNumber(service.mileage || 0, {
                style: 'unit',
                unit: currentVehicle?.mileage_unit || 'kilometer',
                compactDisplay: 'short',
              })
            }}
          </span>
        </li>
        <li class="inline-flex gap-1 items-center">
          <span class="font-semibold">Cost:</span>
          <span>
            {{
              formatNumber(service.cost || 0, {
                style: 'currency',
                currency: service.currency || 'EUR',
                currencyDisplay: 'narrowSymbol',
                compactDisplay: 'short',
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
              })
            }}
          </span>
        </li>
      </ul>

      <div class="divider my-0"></div>

      <p class="capitalize text-sm">{{ service.notes }}</p>

      <div class="divider my-0"></div>

      <span class="font-semibold text-sm">Attachments:</span>

      <FileGrid :files="serviceFiles">
        <template #actions="{ file }">
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-sm btn-ghost m-1">
              <svg
                class="w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                fill="currentColor"
              >
                <path
                  d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z"
                />
              </svg>
            </div>
            <ul
              tabindex="0"
              class="dropdown-content menu menu-sm bg-base-300 rounded-box z-[1] w-52 p-2 shadow"
            >
              <MenuItem @click="filePreviewRef?.open({ path: file.path })">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  class="w-3 fill-current"
                >
                  <path
                    d="M320 464c8.8 0 16-7.2 16-16l0-288-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16l256 0zM0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64z"
                  />
                </svg>
                Preview
              </MenuItem>
              <MenuItem @click="downloadFile(file)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  class="w-3 fill-current"
                >
                  <path
                    d="M448 304H394.5L346.5 352H448C456.822 352 464 359.178 464 368V448C464 456.822 456.822 464 448 464H64C55.178 464 48 456.822 48 448V368C48 359.178 55.178 352 64 352H165.5L117.5 304H64C28.654 304 0 332.654 0 368V448C0 483.346 28.654 512 64 512H448C483.348 512 512 483.346 512 448V368C512 332.654 483.348 304 448 304ZM432 408C432 394.744 421.254 384 408 384S384 394.744 384 408C384 421.254 394.746 432 408 432S432 421.254 432 408ZM239.031 368.969C243.719 373.656 249.844 376 256 376S268.281 373.656 272.969 368.969L408.969 232.969C418.344 223.594 418.344 208.406 408.969 199.031S384.406 189.656 375.031 199.031L280 294.062V24C280 10.75 269.25 0 256 0S232 10.75 232 24V294.062L136.969 199.031C127.594 189.656 112.406 189.656 103.031 199.031S93.656 223.594 103.031 232.969L239.031 368.969Z"
                  />
                </svg>
                Download
              </MenuItem>
              <MenuItem @click="handleFileDelete(file)">
                <TrashIcon class="w-3" />
                Delete
              </MenuItem>
            </ul>
          </div>
        </template>
      </FileGrid>
    </div>
  </div>
</template>
