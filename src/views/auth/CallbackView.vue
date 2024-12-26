<script setup lang="ts">
import { useSessionStore } from '@/stores/general/userSession';
import { onMounted, toRef } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const sessionStore = useSessionStore();

const isAuthenticated = toRef(sessionStore, 'isAuthenticated');

onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/');
  }
});
</script>

<template>
  <div>Callback</div>
</template>
