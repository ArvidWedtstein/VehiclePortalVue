<script setup lang="ts">
import { ref } from 'vue';
import FormDialog from './FormDialog.vue';
import { supabase } from '@/lib/supabaseClient';

type Props = {
  bucket: string;
  alt?: string;
};

const props = withDefaults(defineProps<Props>(), {
  alt: 'Image preview',
});

const modalRef = ref<InstanceType<typeof FormDialog> | null>(null);

const source = ref('');

const fetchUrl = async (path: string) => {
  const { data, error } = await supabase.storage
    .from(props.bucket)
    .createSignedUrl(path, 7200);

  if (error) {
    console.error('Error fetching signed url:', error);
    return;
  }

  source.value = data.signedUrl || '';
};

const handleOpen = async ({ src, path }: { src?: string; path?: string }) => {
  if (!path) {
    source.value = src || '';
    modalRef.value?.modalRef?.showModal();

    return;
  }

  await fetchUrl(path);

  modalRef.value?.modalRef?.showModal();
};

const onClose = () => {
  source.value = '';
};

const handleError = (event: Event) => {
  console.log(event);
  console.error('Error loading image');
};

defineExpose({
  modalRef,
  open: handleOpen,
  close: () => {
    modalRef.value?.modalRef?.close();
  },
});
</script>

<template>
  <FormDialog id="serviceModal" ref="modalRef" title="Preview" @close="onClose">
    <img
      v-if="source && source.length && !source.includes('pdf')"
      :src="source"
      :alt="alt"
      :key="source"
      class="aspect-square w-max max-w-full object-cover rounded image-full"
      @error="handleError"
    />

    <iframe
      v-else-if="source && source.length && source.includes('pdf')"
      :src="source"
      type="application/pdf"
      class="w-full h-full min-h-96 max-w-full image-full"
      :frameborder="0"
      @error="handleError"
    />

    <p v-else>No image to preview</p>

    <template #actions>
      <button
        class="btn btn-outline mt-2"
        value="cancel"
        formmethod="dialog"
        formnovalidate
      >
        Close
      </button>
    </template>
  </FormDialog>
</template>
