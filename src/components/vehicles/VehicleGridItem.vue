<script setup lang="ts">
import CarIcon from '@/assets/icons/CarIcon.vue';
import GearShifter from '@/assets/icons/GearShifter.vue';
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

      <div class="flex justify-between items-center gap-3 w-full grow">
        <ul class="space-y-1">
          <li v-if="vehicle.type">
            <CarIcon v-if="vehicle.type === 'M1'" class="h-6" />

            <MotorcycleIcon
              v-if="vehicle.type === 'L3e' || vehicle.type === 'MCT'"
              class="w-6"
            />
          </li>
          <li v-if="vehicle.engine_size" class="flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
              class="w-6 h-6 fill-current"
            >
              <path
                d="M192 232C178.746 232 168 242.744 168 256C168 269.254 178.746 280 192 280S216 269.254 216 256C216 242.744 205.254 232 192 232ZM592 192H560C533.49 192 512 213.49 512 240V256H496V207.98C496 203.125 493.793 198.531 489.999 195.5L418.723 138.498C410.223 131.703 415.664 128 404.781 128H312V112H376C389.254 112 400 101.254 400 88C400 74.744 389.254 64 376 64H200C186.746 64 176 74.744 176 88C176 101.254 186.746 112 200 112H264V128H128C101.49 128 80 149.49 80 176V232H48V152C48 138.744 37.254 128 24 128S0 138.744 0 152V360C0 373.254 10.746 384 24 384S48 373.254 48 360V280H80V336C80 362.51 101.49 384 128 384H169.375L219.32 433.945C228.32 442.943 240.523 448 253.25 448H448C474.51 448 496 426.51 496 400V384H512V400C512 426.51 533.49 448 560 448H592C618.51 448 640 426.51 640 400V240C640 213.49 618.51 192 592 192ZM448 400L253.262 400.006L203.316 350.059L189.258 336H128V176H388.762L448 223.373V400ZM592 400H560V336H496V304H560V240H592V400ZM288 232C274.746 232 264 242.744 264 256C264 269.254 274.746 280 288 280S312 269.254 312 256C312 242.744 301.254 232 288 232ZM360 256C360 269.254 370.746 280 384 280S408 269.254 408 256C408 242.744 397.254 232 384 232S360 242.744 360 256Z"
              />
            </svg>
            {{ vehicle.engine_size }}
          </li>
          <li v-if="vehicle.transmission_gears" class="flex gap-2 items-center">
            <GearShifter
              class="w-6 fill-current"
              :gears="vehicle.transmission_gears || 5"
            />
            {{ vehicle.transmission_gears }} gears
          </li>
        </ul>
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
