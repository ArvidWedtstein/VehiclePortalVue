<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import PageNavbar from './components/layout/PageNavbar.vue';
import { useSessionStore } from './stores/userSession';
import MobileNavigation from './components/layout/MobileNavigation.vue';
import ToastManager from './components/general/utils/ToastManager.vue';
import ConfirmManager from './components/general/utils/ConfirmManager.vue';

const { initialize } = useSessionStore();

onMounted(() => {
  initialize();
});
</script>

<template>
  <main class="min-h-full bg-base-100">
    <PageNavbar />

    <div class="px-4 py-3 sm:px-6 lg:px-8 max-w-full">
      <RouterView />
    </div>

    <ToastManager />
    <ConfirmManager />

    <MobileNavigation />
  </main>
</template>
