<script setup lang="ts">
import { ref } from 'vue';
import FormDialog from '@/components/general/modal/FormDialog.vue';

import ImageCropper from './ImageCropper.vue';

const modalRef = ref();
const cropperRef = ref();

const imageSource = ref('');

const onSubmit = () => {
  const croppedImage = cropperRef.value.cropImage();

  emit('submit', croppedImage);
};

const handleOpen = async (imageSrc: string) => {
  console.log('open', imageSrc);
  imageSource.value = imageSrc;
  modalRef.value.modalRef.showModal();
};

const emit = defineEmits<{
  submit: [img: HTMLImageElement];
}>();

defineExpose({ modalRef: modalRef, open: handleOpen });
</script>

<template>
  <FormDialog id="expenseModal" ref="modalRef" @submit="onSubmit">
    <ImageCropper
      ref="cropperRef"
      v-if="imageSource !== ''"
      :imageSrc="imageSource"
      class="mb-2"
    />
  </FormDialog>
</template>
