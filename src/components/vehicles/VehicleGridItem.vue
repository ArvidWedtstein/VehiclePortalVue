<script setup lang="ts">
import CarIcon from '@/assets/icons/CarIcon.vue';
import GearShifter from '@/assets/icons/GearShifter.vue';
import MotorcycleIcon from '@/assets/icons/MotorcycleIcon.vue';
import type { Tables } from '@/database.types';
import {
  useVehiclesStore,
  type VehicleShareWithProfile,
} from '@/stores/vehicles';
import { formatNumber } from '@/utils/format';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import AvatarImage from '../general/utils/AvatarImage.vue';

const vehicleStore = useVehiclesStore();
const { getVehicleShares } = vehicleStore;

type Props = {
  vehicle: Tables<'Vehicles'>;
};

const props = defineProps<Props>();

const shares = ref<VehicleShareWithProfile[]>([]);

onMounted(async () => {
  shares.value = await getVehicleShares(props.vehicle.id);
});
</script>

<template>
  <RouterLink :to="{ name: 'vehicle', params: { vehicle_id: vehicle.id } }"
    class="card card-bordered md:card-normal card-compact bg-base-100 shadow hover:shadow-xl h-full transition-shadow">
    <div class="card-body">
      <div class="flex flex-row items-center gap-3">

        <h2 class="card-title !mb-0 grow">
          {{ vehicle.make }} {{ vehicle.model }}
        </h2>

        <RouterLink :to="{ name: 'vehicle', params: { vehicle_id: vehicle.id } }"
          class="btn btn-sm btn-square btn-primary btn-ghost md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="w-5 h-5 fill-current">
            <path
              d="M113.333 47.409L297.314 239.407C301.783 244.032 304.001 250.032 304.001 256.001S301.783 267.969 297.314 272.594L113.333 464.592C104.181 474.186 88.994 474.499 79.431 465.311C69.806 456.186 69.494 440.936 78.712 431.405L246.759 256.001L78.712 80.596C69.494 71.096 69.806 55.815 79.431 46.69C88.994 37.503 104.181 37.815 113.333 47.409Z" />
          </svg>
        </RouterLink>

        <div class="avatar">
          <div v-if="vehicle.type" class="flex justify-center items-center w-12 text-base-content p-2">
            <CarIcon v-if="vehicle.type === 'Car'" class="h-8" />

            <MotorcycleIcon v-if="vehicle.type === 'Motorcycle'" class="w-7" />
          </div>
        </div>
      </div>

      <div class="hidden md:flex justify-between items-center gap-3 w-full grow">
        <ul class="space-y-1">
          <li v-if="vehicle.engine_displacement" class="flex gap-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="w-6 h-6 fill-current">
              <path
                d="M192 232C178.746 232 168 242.744 168 256C168 269.254 178.746 280 192 280S216 269.254 216 256C216 242.744 205.254 232 192 232ZM592 192H560C533.49 192 512 213.49 512 240V256H496V207.98C496 203.125 493.793 198.531 489.999 195.5L418.723 138.498C410.223 131.703 415.664 128 404.781 128H312V112H376C389.254 112 400 101.254 400 88C400 74.744 389.254 64 376 64H200C186.746 64 176 74.744 176 88C176 101.254 186.746 112 200 112H264V128H128C101.49 128 80 149.49 80 176V232H48V152C48 138.744 37.254 128 24 128S0 138.744 0 152V360C0 373.254 10.746 384 24 384S48 373.254 48 360V280H80V336C80 362.51 101.49 384 128 384H169.375L219.32 433.945C228.32 442.943 240.523 448 253.25 448H448C474.51 448 496 426.51 496 400V384H512V400C512 426.51 533.49 448 560 448H592C618.51 448 640 426.51 640 400V240C640 213.49 618.51 192 592 192ZM448 400L253.262 400.006L203.316 350.059L189.258 336H128V176H388.762L448 223.373V400ZM592 400H560V336H496V304H560V240H592V400ZM288 232C274.746 232 264 242.744 264 256C264 269.254 274.746 280 288 280S312 269.254 312 256C312 242.744 301.254 232 288 232ZM360 256C360 269.254 370.746 280 384 280S408 269.254 408 256C408 242.744 397.254 232 384 232S360 242.744 360 256Z" />
            </svg>
            {{
              formatNumber(vehicle.engine_displacement, {
                style: 'unit',
                unit: vehicle.engine_displacement_unit || 'liter',
                unitDisplay: 'short',
              })
            }}
          </li>
          <li v-if="vehicle.transmission_gears" class="flex gap-2 items-center">
            <GearShifter class="w-6 fill-current" :gears="vehicle.transmission_gears || 5" />
            {{ vehicle.transmission_gears }} gears
          </li>
        </ul>
      </div>

      <div class="hidden md:card-actions justify-end items-center mt-2">
        <div class="avatar-group -space-x-4 rtl:space-x-reverse me-auto">
          <AvatarImage v-for="(share, shareIndex) in shares" :key="shareIndex" :src="share.Profiles.profile_image_url"
            alt="User Profile Image"
            :fallbackSrc="`https://ui-avatars.com/api/?name=${share.Profiles.name || 'Unknown User'}`" size="xs" />

          <!-- <div class="avatar placeholder">
            <div class="bg-neutral text-neutral-content w-8">
              <span>+9</span>
            </div>
          </div> -->
        </div>

        <RouterLink :to="{ name: 'vehicle', params: { vehicle_id: vehicle.id } }" class="btn btn-sm btn-primary">
          View
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="w-3 h-3 fill-current">
            <path
              d="M113.333 47.409L297.314 239.407C301.783 244.032 304.001 250.032 304.001 256.001S301.783 267.969 297.314 272.594L113.333 464.592C104.181 474.186 88.994 474.499 79.431 465.311C69.806 456.186 69.494 440.936 78.712 431.405L246.759 256.001L78.712 80.596C69.494 71.096 69.806 55.815 79.431 46.69C88.994 37.503 104.181 37.815 113.333 47.409Z" />
          </svg>
        </RouterLink>
      </div>
    </div>
  </RouterLink>
</template>
