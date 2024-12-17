<script setup lang="ts">
import { ref, onMounted } from 'vue';

const modalRef = ref<InstanceType<typeof HTMLDialogElement>>();
const formRef = ref<InstanceType<typeof HTMLFormElement>>();

type Props = {
  id?: string;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  backdrop?: boolean;
  /**
   * Disables submit button
   */
  loading?: boolean;
};

withDefaults(defineProps<Props>(), {
  id: crypto.randomUUID(),
  size: 'lg',
  backdrop: true,
  loading: false,
});

const emit = defineEmits<{
  (e: 'submit', event: Event): void;
  (e: 'open'): void;
  (e: 'close', event: Event): void;
}>();

const handleSubmit = (event: Event) => {
  if (!modalRef.value) return;

  formRef.value?.checkValidity();

  const returnValue =
    ((event as SubmitEvent)?.submitter as HTMLButtonElement)?.value ||
    modalRef.value.returnValue;

  // formRef.value?.reset();
  if (returnValue === 'cancel') {
    modalRef.value.close('cancel');
    return;
  }

  emit('submit', event);

  modalRef.value.close('submit');
};

const handleClose = (event: Event) => {
  emit('close', event);
};

const observer = new MutationObserver(event => {
  if (event[0].attributeName == 'open' && modalRef.value?.open) {
    emit('open');
  }
});

onMounted(() => {
  if (!modalRef.value) return;

  observer.observe(modalRef.value, { attributes: true });
});

defineExpose({ modalRef: modalRef });
</script>

<template>
  <Teleport to="body">
    <dialog
      :id="id"
      ref="modalRef"
      class="modal modal-top md:modal-middle modal-scroll"
      @close="handleClose"
    >
      <form
        class="modal-box flex flex-col"
        :class="{
          '!w-4/12': size === 'sm',
          'md:!w-8/12 !max-w-2xl': size === 'md',
          'md:!w-11/12 !max-w-5xl max-h-full h-full md:h-fit': size === 'lg',
        }"
        @submit.prevent="handleSubmit"
        ref="formRef"
      >
        <button
          class="btn btn-circle btn-sm btn-ghost absolute right-2 top-2"
          formmethod="dialog"
          value="cancel"
        >
          ✕
        </button>

        <h3 class="text-lg font-bold">
          {{ title }}
        </h3>

        <slot></slot>

        <div class="modal-action gap-1 mt-auto">
          <slot name="actions" :loading="loading" @submit="handleSubmit">
            <button
              class="btn btn-outline"
              value="cancel"
              formmethod="dialog"
              formnovalidate
            >
              Cancel
            </button>

            <button
              type="submit"
              class="btn btn-primary"
              value="submit"
              :disabled="loading"
            >
              OK
            </button>
          </slot>
        </div>
      </form>
      <form v-if="backdrop" method="dialog" class="modal-backdrop">
        <button value="cancel">close</button>
      </form>
    </dialog>
  </Teleport>
</template>
