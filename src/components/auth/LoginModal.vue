<script setup lang="ts">
import { reactive, ref } from 'vue';
import FormInput from '@/components/general/form/FormInput.vue';
import FormDialog from '@/components/general/modal/FormDialog.vue';
import { useSessionStore } from '@/stores/general/userSession';

const modalRef = ref<InstanceType<typeof FormDialog> | null>(null);
const { login, googleLogin } = useSessionStore();

const formData = reactive({
  loading: false,
  email: '',
});

const onModalClose = () => {
  formData.email = '';
};

const onFormSubmit = async () => {
  try {
    formData.loading = true;

    await login(formData.email);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  } finally {
    formData.loading = false;
  }
};

const signInWithGoogle = async () => {
  await googleLogin();
};

defineExpose({
  modalRef,
  open: () => modalRef.value?.modalRef?.showModal(),
  close: () => modalRef.value?.modalRef?.close(),
});
</script>

<template>
  <FormDialog
    ref="modalRef"
    size="md"
    title="Sign in via magic link with your email below"
    @close="onModalClose"
    @submit="onFormSubmit"
  >
    <div class="my-2 grid grid-cols-1 gap-2">
      <FormInput
        label="Email"
        type="email"
        required
        v-model="formData.email"
        autofocus
      />

      <div class="divider">Or</div>

      <button type="button" class="btn btn-accent" @click="signInWithGoogle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
          class="w-3 fill-current"
        >
          <path
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          />
        </svg>
        Sign in with Google
      </button>
    </div>

    <template #actions>
      <button
        class="btn btn-outline"
        value="cancel"
        formmethod="dialog"
        formnovalidate
      >
        Close
      </button>

      <button
        type="submit"
        class="btn btn-primary"
        value="submit"
        :disabled="formData.loading"
      >
        <span
          v-if="formData.loading"
          class="loading loading-spinner loading-xs"
        ></span>
        OK
      </button>
    </template>
  </FormDialog>
</template>
