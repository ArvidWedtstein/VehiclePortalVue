<script setup lang="ts">
import VehiclesList from '@/components/vehicles/VehiclesList.vue';
</script>

<template>
  <RouterView v-slot="{ Component }">
    <component v-if="Component" :is="Component" />

    <VehiclesList v-else />
  </RouterView>
</template>
