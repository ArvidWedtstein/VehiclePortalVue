<script setup lang="ts">
import ServicesTab from '@/components/vehicles/services/ServicesTab.vue';
</script>

<template>
  <RouterView v-slot="{ Component }">
    <component v-if="Component" :is="Component" />

    <ServicesTab v-else />
  </RouterView>
</template>
