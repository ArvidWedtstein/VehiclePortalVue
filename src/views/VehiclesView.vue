<script setup lang="ts">
import VehiclesGrid from '@/components/vehicles/VehiclesGrid.vue';
</script>

<template>
  <RouterView v-slot="{ Component }">
    <VehiclesGrid v-if="!Component" />

    <component v-else :is="Component" />
  </RouterView>
</template>
