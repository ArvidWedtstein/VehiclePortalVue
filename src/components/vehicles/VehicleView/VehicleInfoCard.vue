<script setup lang="ts">
import type { Tables } from '@/database.types';
import { useVehiclesStore } from '@/stores/vehicles';
import { toRef } from 'vue';
import ShareVehicleDrawer from '../VehicleModal/ShareVehicleDrawer.vue';

const vehiclesStore = useVehiclesStore();
const currentVehicle = toRef(vehiclesStore, 'currentVehicle');

const emit = defineEmits<{
  (e: 'edit', vehicle_id: Tables<'Vehicles'>['id']): void;
  (e: 'share', vehicle_id: Tables<'Vehicles'>['id']): void;
}>();
</script>

<template>
  <div
    class="card card-bordered bg-base-200 card-compact lg:card-normal h-full shrink-0"
    v-if="currentVehicle"
  >
    <div class="card-body">
      <div class="flex justify-between items-center gap-6">
        <h2 class="card-title !mb-0">
          {{
            [
              `${currentVehicle.make} ${currentVehicle.model}`,
              currentVehicle.registered_date
                ? new Date(currentVehicle.registered_date).getFullYear()
                : null,
            ]
              .filter(Boolean)
              .join(', ')
          }}
        </h2>

        <div class="flex justify-end items-center gap-1">
          <button
            type="button"
            class="btn btn-sm btn-neutral btn-outline"
            title="Share"
            @click="emit('edit', currentVehicle.id)"
          >
            Edit
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="w-3 fill-current"
            >
              <path
                d="M455.703 18.748C443.209 6.252 426.829 0 410.452 0C394.07 0 377.695 6.25 365.196 18.75L45.11 338.885C36.542 347.451 30.584 358.275 27.926 370.094L0.319 492.854C-1.701 502.967 6.158 512 15.946 512C16.993 512 18.061 511.896 19.143 511.68C19.143 511.68 103.751 493.73 141.894 484.748C153.432 482.031 163.759 476.225 172.139 467.844C221.264 418.719 406.649 233.33 493.302 146.676C518.294 121.684 518.202 81.256 493.212 56.262L455.703 18.748ZM138.201 433.902C136.086 436.018 133.697 437.365 130.893 438.025C112.719 442.307 83.432 448.738 58.204 454.203L74.751 380.627C75.417 377.668 76.902 374.973 79.048 372.824L320.936 130.902L381.064 191.035L138.201 433.902Z"
              />
            </svg>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-secondary btn-outline"
            title="Share"
            @click="emit('share', currentVehicle.id)"
          >
            Share
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="w-3 fill-current"
            >
              <path
                d="M307 34.8c-11.5 5.1-19 16.6-19 29.2l0 64-112 0C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96l96 0 0 64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z"
              />
            </svg>
          </button>

          <ShareVehicleDrawer />
        </div>
      </div>
      <div class="-mt-2 text-gray-500 flex gap-1 items-center">
        <small>{{ currentVehicle.engine_size }}</small>
        <small>{{ currentVehicle.body_type }}</small>
        <div
          class="w-1 h-1 bg-gray-500 rounded-full inline-block leading-none mx-1"
        ></div>
        <small class="flex gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="w-3 fill-current"
          >
            <path
              v-if="currentVehicle.fuel_type === 'Electric'"
              d="M96 0C60.7 0 32 28.7 32 64l0 384c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-144 16 0c22.1 0 40 17.9 40 40l0 32c0 39.8 32.2 72 72 72s72-32.2 72-72l0-123.7c32.5-10.2 56-40.5 56-76.3l0-32c0-8.8-7.2-16-16-16l-16 0 0-48c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 48-32 0 0-48c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 48-16 0c-8.8 0-16 7.2-16 16l0 32c0 35.8 23.5 66.1 56 76.3L472 376c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-32c0-48.6-39.4-88-88-88l-16 0 0-192c0-35.3-28.7-64-64-64L96 0zM216.9 82.7c6 4 8.5 11.5 6.3 18.3l-25 74.9 57.8 0c6.7 0 12.7 4.2 15 10.4s.5 13.3-4.6 17.7l-112 96c-5.5 4.7-13.4 5.1-19.3 1.1s-8.5-11.5-6.3-18.3l25-74.9L96 208c-6.7 0-12.7-4.2-15-10.4s-.5-13.3 4.6-17.7l112-96c5.5-4.7 13.4-5.1 19.3-1.1z"
            />
            <path
              v-else
              d="M32 64C32 28.7 60.7 0 96 0L256 0c35.3 0 64 28.7 64 64l0 192 8 0c48.6 0 88 39.4 88 88l0 32c0 13.3 10.7 24 24 24s24-10.7 24-24l0-154c-27.6-7.1-48-32.2-48-62l0-64L384 64c-8.8-8.8-8.8-23.2 0-32s23.2-8.8 32 0l77.3 77.3c12 12 18.7 28.3 18.7 45.3l0 13.5 0 24 0 32 0 152c0 39.8-32.2 72-72 72s-72-32.2-72-72l0-32c0-22.1-17.9-40-40-40l-8 0 0 144c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32L32 64zM96 80l0 96c0 8.8 7.2 16 16 16l128 0c8.8 0 16-7.2 16-16l0-96c0-8.8-7.2-16-16-16L112 64c-8.8 0-16 7.2-16 16z"
            />
          </svg>
          {{ currentVehicle.fuel_type }}
        </small>
      </div>
    </div>
  </div>
</template>
