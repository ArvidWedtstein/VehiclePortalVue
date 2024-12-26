<script setup lang="ts">
import LoginModal from '@/components/auth/LoginModal.vue';

import { useSessionStore } from '@/stores/general/userSession';
import { onMounted, ref, toRef } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const sessionStore = useSessionStore();

const isAuthenticated = toRef(sessionStore, 'isAuthenticated');

const loginModalRef = ref<InstanceType<typeof LoginModal>>();

onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/');
    return;
  }
  loginModalRef.value?.open();
});
</script>

<template>
  <div>
    <LoginModal ref="loginModalRef" />
  </div>
</template>
