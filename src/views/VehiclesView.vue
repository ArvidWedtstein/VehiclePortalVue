<script setup lang="ts">
import VehiclesGrid from '@/components/vehicles/VehiclesGrid.vue';
</script>

<template>
  <RouterView v-slot="{ Component }">
    <component v-if="Component" :is="Component" />

    <VehiclesGrid v-else />
  </RouterView>
</template>
