<script setup lang="ts">
import CarIcon from '@/assets/icons/CarIcon.vue';
import MotorcycleIcon from '@/assets/icons/MotorcycleIcon.vue';
import type { Tables } from '@/database.types';
import { RouterLink } from 'vue-router';

type Props = {
  vehicle: Tables<'Vehicles'>;
};

defineProps<Props>();

defineEmits<{
  (e: 'editVehicle', vehicle_id: number): void;
}>();
</script>

<template>
  <div class="card bg-base-100 image-full shadow-xl">
    <figure>
      <!-- <img :src="vehicle" alt="car" loading="lazy" /> -->
      <CarIcon v-if="vehicle.type === 'M1'" class="h-14" />

      <MotorcycleIcon
        v-if="vehicle.type === 'L3e' || vehicle.type === 'MCT'"
        class="h-14"
      />
    </figure>
    <div class="card-body">
      <h2 class="card-title">{{ vehicle.make }} {{ vehicle.model }}</h2>

      <div class="card-actions justify-end">
        <button
          type="button"
          class="btn btn-sm btn-outline btn-secondary"
          @click="$emit('editVehicle', vehicle.id)"
        >
          Edit
        </button>
        <RouterLink
          :to="{ name: 'vehicle', params: { id: vehicle.id } }"
          class="btn btn-sm btn-primary"
        >
          View
        </RouterLink>
      </div>
    </div>
  </div>
</template>
