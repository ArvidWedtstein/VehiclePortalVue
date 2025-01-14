<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { computed, defineAsyncComponent, ref, toRef, toRefs } from 'vue';
import ShareVehicleDrawer from '../VehicleModal/ShareVehicleDrawer.vue';
import { useProfilesStore } from '@/stores/profiles';
import ChangelogDrawer from '../changelog/ChangelogDrawer.vue';
import { formatNumber } from '@/utils/format';
import EditIcon from '@/assets/icons/EditIcon.vue';
import AvatarImage from '@/components/general/utils/AvatarImage.vue';

const VehicleModal = defineAsyncComponent(
  async () =>
    await import('@/components/vehicles/VehicleModal/VehicleModal.vue'),
);

const vehicleModalRef = ref<InstanceType<typeof VehicleModal> | null>(null);
const shareVehicleDrawerRef = ref<InstanceType<
  typeof ShareVehicleDrawer
> | null>(null);

const changelogDrawerRef = ref<InstanceType<typeof ChangelogDrawer> | null>(
  null,
);

const vehiclesStore = useVehiclesStore();
const { currentVehicle, vehicleShares } = toRefs(vehiclesStore);

const profilesStore = useProfilesStore();
const profiles = toRef(profilesStore, 'profiles');

const editVehicle = () => {
  if (!currentVehicle.value) return;

  vehicleModalRef.value?.open(currentVehicle.value.id);
};

const openShareVehicleDrawer = () => {
  shareVehicleDrawerRef.value?.drawerRef?.open();
};
const openChangelogDrawer = () => {
  changelogDrawerRef.value?.drawerRef?.open();
};

const currentVehicleOwner = computed(() => {
  return profiles.value.find(
    p => p.user_id === currentVehicle.value?.owner_user_id,
  );
});
</script>

<template>
  <VehicleModal ref="vehicleModalRef" />
  <ChangelogDrawer ref="changelogDrawerRef" />
  <ShareVehicleDrawer ref="shareVehicleDrawerRef" />

  <div
    class="card image-full card-bordered bg-base-200 card-compact lg:card-normal shrink"
    v-if="currentVehicle"
  >
    <figure>
      <img
        :src="`https://akhxphgocxpyoofvdqwi.supabase.co/storage/v1/object/public/${currentVehicle.thumbnail}`"
        alt="Car"
        class="object-cover max-h-64 grow"
      />
    </figure>
    <div class="card-body">
      <div class="flex justify-between items-center gap-6">
        <h2 class="card-title !mb-0">
          {{
            [
              `${currentVehicle.make} ${currentVehicle.model}`,
              currentVehicle.model_year,
            ]
              .filter(Boolean)
              .join(', ')
          }}
        </h2>

        <div class="flex justify-end items-center gap-1">
          <button
            type="button"
            class="btn btn-sm btn-neutral btn-outline"
            title="Edit"
            @click="editVehicle"
          >
            <EditIcon class="w-3" />
            <span class="hidden md:inline">Edit</span>
          </button>

          <button
            type="button"
            class="btn btn-sm btn-neutral btn-outline"
            @click="openChangelogDrawer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="w-3 fill-current"
            >
              <path
                d="M48 224C30.334 224 16 238.332 16 256C16 273.666 30.334 288 48 288S80 273.666 80 256C80 238.332 65.666 224 48 224ZM48 384C30.334 384 16 398.332 16 416C16 433.666 30.334 448 48 448S80 433.666 80 416C80 398.332 65.666 384 48 384ZM48 64C30.334 64 16 78.332 16 96C16 113.666 30.334 128 48 128S80 113.666 80 96C80 78.332 65.666 64 48 64ZM480 192H198.627C190.141 192 182.002 195.371 176 201.373L132.686 244.686C126.437 250.936 126.437 261.064 132.686 267.314L176 310.627C182.002 316.629 190.141 320 198.627 320H480C497.674 320 512 305.672 512 288V224C512 206.326 497.674 192 480 192ZM464 272H205.254L189.254 256L205.254 240H464V272ZM416 352H198.627C190.141 352 182.002 355.371 176 361.373L132.686 404.686C126.437 410.936 126.437 421.064 132.686 427.314L176 470.627C182.002 476.629 190.141 480 198.627 480H416C433.674 480 448 465.672 448 448V384C448 366.326 433.674 352 416 352ZM400 432H205.254L189.254 416L205.254 400H400V432ZM176 150.627C182.002 156.629 190.141 160 198.627 160H416C433.674 160 448 145.672 448 128V64C448 46.326 433.674 32 416 32H198.627C190.141 32 182.002 35.371 176 41.373L132.686 84.686C126.437 90.936 126.437 101.064 132.686 107.314L176 150.627ZM205.254 80H400V112H205.254L189.254 96L205.254 80Z"
              />
            </svg>
            Changelog
          </button>
          <!-- TODO: finish-->
          <!-- <button
            type="button"
            class="btn btn-sm btn-neutral btn-outline"
            title="Transfer ownership"
          >
            Transfer ownership
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="w-3 fill-current"
            >
              <path
                d="M455.703 18.748C443.209 6.252 426.829 0 410.452 0C394.07 0 377.695 6.25 365.196 18.75L45.11 338.885C36.542 347.451 30.584 358.275 27.926 370.094L0.319 492.854C-1.701 502.967 6.158 512 15.946 512C16.993 512 18.061 511.896 19.143 511.68C19.143 511.68 103.751 493.73 141.894 484.748C153.432 482.031 163.759 476.225 172.139 467.844C221.264 418.719 406.649 233.33 493.302 146.676C518.294 121.684 518.202 81.256 493.212 56.262L455.703 18.748ZM138.201 433.902C136.086 436.018 133.697 437.365 130.893 438.025C112.719 442.307 83.432 448.738 58.204 454.203L74.751 380.627C75.417 377.668 76.902 374.973 79.048 372.824L320.936 130.902L381.064 191.035L138.201 433.902Z"
              />
            </svg>
          </button> -->

          <button
            type="button"
            class="btn btn-sm btn-secondary btn-outline"
            title="Share"
            @click="openShareVehicleDrawer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="w-3 fill-current"
            >
              <path
                d="M307 34.8c-11.5 5.1-19 16.6-19 29.2l0 64-112 0C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96l96 0 0 64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z"
              />
            </svg>
            <span class="hidden md:inline">Share</span>
          </button>
        </div>
      </div>

      <div class="-mt-2 text-gray-500 flex gap-1 items-center">
        <small v-if="currentVehicle.engine_displacement">
          {{
            formatNumber(currentVehicle.engine_displacement, {
              style: 'unit',
              unit: currentVehicle.engine_displacement_unit || 'liter',
              unitDisplay: 'short',
            })
          }}
        </small>
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

      <div class="flex gap-1 items-center" v-if="currentVehicleOwner">
        <small>Owner:</small>
        <RouterLink
          class="tooltip"
          :data-tip="currentVehicleOwner.name"
          :to="{ name: 'profile', params: { id: currentVehicleOwner.id } }"
        >
          <AvatarImage
            size="xxs"
            :src="currentVehicleOwner?.profile_image_url"
            :fallbackSrc="`https://ui-avatars.com/api/?name=${currentVehicleOwner.name}`"
          />
        </RouterLink>

        {{ currentVehicleOwner?.name }}
      </div>

      <div class="flex gap-1 items-center">
        <small>Shared with:</small>
        <div class="avatar-group -space-x-2 rtl:space-x-reverse">
          <RouterLink
            v-for="share in vehicleShares"
            :key="share.id"
            :to="{ name: 'profile', params: { id: share.Profiles.id } }"
          >
            <AvatarImage
              size="xxs"
              :src="share.Profiles.profile_image_url"
              :fallbackSrc="`https://ui-avatars.com/api/?name=${share.Profiles.name}`"
            />
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
