<script setup lang="ts">
import CarIcon from '@/assets/icons/CarIcon.vue';
import MotorcycleIcon from '@/assets/icons/MotorcycleIcon.vue';
import type { Tables } from '@/database.types';
import { RouterLink } from 'vue-router';
type Props = {
  vehicle: Tables<'Vehicles'>;
};

defineProps<Props>();
</script>

<template>
  <div class="card bg-base-100 image-full shadow-xl">
    <figure>
      <!-- <img :src="vehicle" alt="car" loading="lazy" /> -->
    </figure>
    <div class="card-body">
      <h2 class="card-title">{{ vehicle.make }} {{ vehicle.type }}</h2>
      <CarIcon v-if="vehicle.type === 'M1'" />

      <MotorcycleIcon v-if="vehicle.type === 'L3e' || vehicle.type === 'MCT'" class="h-15" />

      <div class="card-actions justify-end">
        <RouterLink
          :to="{ name: 'vehicle', params: { id: vehicle.id } }"
          class="btn btn-primary"
        >
          View
        </RouterLink>
      </div>
    </div>
  </div>
</template>
