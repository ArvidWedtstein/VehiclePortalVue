<script setup lang="ts">
import CarIcon from '@/assets/icons/CarIcon.vue';
import MotorcycleIcon from '@/assets/icons/MotorcycleIcon.vue';
import type { Tables } from '@/database.types';
import { useVehiclesStore } from '@/stores/vehicles';
import { getInitials } from '@/utils/utils';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

const { getVehicleShares } = useVehiclesStore();

type Props = {
  vehicle: Tables<'Vehicles'>;
};

const props = defineProps<Props>();

defineEmits<{
  (e: 'editVehicle', vehicle_id: number): void;
}>();

const shares = ref<Tables<'VehicleShares'>[]>([]);
onMounted(async () => {
  shares.value = await getVehicleShares(props.vehicle.id);
});
</script>

<template>
  <div
    class="card card-bordered md:card-normal card-compact bg-base-100 shadow-xl h-full"
  >
    <div class="card-body">
      <h2 class="card-title">{{ vehicle.make }} {{ vehicle.model }}</h2>

      <div class="flex justify-between items-center gap-3 w-full">
        <CarIcon v-if="vehicle.type === 'M1'" class="w-12 h-12" />

        <MotorcycleIcon
          v-if="vehicle.type === 'L3e' || vehicle.type === 'MCT'"
          class="w-12"
        />
        <p class="shrink">{{ vehicle.engine_size }}</p>
      </div>

      <div class="card-actions justify-end items-center mt-2">
        <div class="avatar-group -space-x-4 rtl:space-x-reverse me-auto">
          <div
            v-for="(share, shareIndex) in shares"
            :key="shareIndex"
            class="avatar"
            :class="{ placeholder: !share.Profiles.profile_image_url }"
          >
            <div class="bg-neutral text-neutral-content w-8">
              <img
                v-if="share.Profiles.profile_image_url"
                :src="share.Profiles.profile_image_url"
              />
              <span v-else>{{ getInitials(share.Profiles.name) }}</span>
            </div>
          </div>

          <!-- <div class="avatar placeholder">
            <div class="bg-neutral text-neutral-content w-8">
              <span>+9</span>
            </div>
          </div> -->
        </div>
        <button
          type="button"
          class="btn btn-sm btn-ghost btn-secondary"
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
