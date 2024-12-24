<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import PageNavbar from './components/layout/PageNavbar.vue';
import { useSessionStore } from './stores/general/userSession';
import MobileNavigation from './components/layout/MobileNavigation.vue';
import ToastManager from './components/general/utils/ToastManager.vue';
import ConfirmManager from './components/general/utils/ConfirmManager.vue';

const { initialize } = useSessionStore();

onMounted(() => {
  initialize();
});
</script>

<template>
  <main class="bg-base-100 flex flex-col flex-grow">
    <PageNavbar />

    <div
      class="flex flex-col px-4 py-3 sm:px-6 lg:px-8 max-w-full min-h-screen max-h-screen"
    >
      <RouterView />
    </div>

    <ToastManager />
    <ConfirmManager />

    <MobileNavigation />
  </main>
</template>
