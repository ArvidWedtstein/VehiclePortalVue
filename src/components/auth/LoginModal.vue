<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import FormInput from '@/components/general/form/FormInput.vue';
import FormDialog from '@/components/general/modal/FormDialog.vue';
import { useSessionStore } from '@/stores/userSession';

const modalRef = ref<InstanceType<typeof HTMLDialogElement> | null>(null);
const { login } = useSessionStore();

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

onMounted(() => {});
</script>

<template>
  <FormDialog
    id="loginModal"
    ref="modalRef"
    size="md"
    title="Sign in via magic link with your email below"
    @close="onModalClose"
    @submit="onFormSubmit"
  >
    <div class="mt-2 grid grid-cols-1">
      <FormInput label="Email" type="email" required v-model="formData.email" />
    </div>

    <template #actions>
      <button
        type="submit"
        class="btn btn-sm btn-primary ms-1"
        value="submit"
        :disabled="formData.loading"
      >
        OK
        <span
          v-if="formData.loading"
          class="loading loading-spinner loading-xs"
        ></span>
      </button>
    </template>
  </FormDialog>
</template>
