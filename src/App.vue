<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import PageNavbar from './components/PageNavbar.vue';
import { useSessionStore } from './stores/userSession';
import ToastAlert from './components/general/utils/ToastAlert.vue';

const { initialize } = useSessionStore();

onMounted(() => {
  initialize();
});
</script>

<template>
  <div class="min-h-full">
    <ToastAlert />
    <PageNavbar />

    <main>
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>
