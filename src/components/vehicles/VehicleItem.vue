<script setup lang="ts">
import type { Vehicle } from '@/types';
import { RouterLink } from 'vue-router';
type Props = {
  vehicle: Vehicle;
};

defineProps<Props>();
</script>

<template>
  <div class="card bg-base-100 image-full shadow-xl">
    <figure>
      <img :src="vehicle.imageUrl" alt="car" loading="lazy" />
    </figure>
    <div class="card-body">
      <h2 class="card-title">{{ vehicle.name }} {{ vehicle.make }}</h2>
      <p>{{ vehicle.model }}</p>
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
