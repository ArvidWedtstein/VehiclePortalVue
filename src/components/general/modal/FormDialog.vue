<script setup lang="ts">
import { ref, withDefaults, defineEmits, defineExpose, onMounted } from 'vue';

const modalRef = ref<InstanceType<typeof HTMLDialogElement>>();
const formRef = ref<InstanceType<typeof HTMLFormElement>>();

type Props = {
  id?: string;
  title?: string;
};

withDefaults(defineProps<Props>(), {
  id: crypto.randomUUID(),
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
    modalRef.value.returnValue ||
    ((event as SubmitEvent).submitter as HTMLButtonElement).value;

  // formRef.value?.reset();
  if (returnValue === 'cancel') {
    modalRef.value.close();
    return;
  }

  emit('submit', event);

  modalRef.value.close();
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

defineExpose(modalRef.value);
</script>

<template>
  <dialog
    :id="id"
    ref="modalRef"
    class="modal modal-bottom sm:modal-middle"
    @close="handleClose"
  >
    <form
      class="modal-box !w-11/12 !max-w-5xl"
      @submit.prevent="handleSubmit"
      ref="formRef"
    >
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        formmethod="dialog"
        formnovalidate
        value="cancel"
      >
        ✕
      </button>

      <h3 class="text-lg font-bold">
        {{ title }}
      </h3>

      <slot></slot>

      <div class="modal-action">
        <button
          class="btn btn-sm btn-outline"
          value="cancel"
          formmethod="dialog"
          formnovalidate
        >
          Close
        </button>

        <slot name="actions">
          <button
            type="submit"
            class="btn btn-sm btn-primary ms-1"
            value="submit"
          >
            OK
          </button>
        </slot>
      </div>
    </form>
  </dialog>
</template>
