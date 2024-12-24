<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { computed, onMounted, ref, toRefs } from 'vue';
import { groupBy } from '@/utils/utils';
import type { Tables } from '@/database.types';
import { useProfilesStore } from '@/stores/profiles';
import { useToastStore } from '@/stores/general/toasts';
import ListGroup from '@/components/general/list/ListGroup.vue';
import ListSubGroup from '@/components/general/list/ListSubGroup.vue';
import ListGroupItem from '@/components/general/list/ListGroupItem.vue';
import { useBreakpoints } from '@/lib/composables/useBreakpoints';
import MobileDrawer from '@/components/general/modal/MobileDrawer.vue';

const { isMd } = useBreakpoints();

const vehiclesStore = useVehiclesStore();
const { getProfiles } = useProfilesStore();

const { currentVehicle, vehicleShares } = toRefs(vehiclesStore);
const { shareVehicle, unShareVehicle } = vehiclesStore;

const { addToast } = useToastStore();

const drawerRef = ref<InstanceType<typeof MobileDrawer> | null>(null);

const users = ref<Tables<'Profiles'>[]>([]);

const personsModel = ref<Tables<'Profiles'>[]>([]);
const vehiclesShare = ref<Tables<'VehicleShares'>[]>([]);

const addedShares = ref<Tables<'VehicleShares'>['user_id'][]>([]);
const removedShares = ref<Tables<'VehicleShares'>['user_id'][]>([]);

const groupedPersons = computed(() =>
  groupBy(
    users.value
      .filter(user => user.user_id !== currentVehicle.value?.createdby_id)
      .map(p => ({ ...p, firstLetter: (p.name || '').charAt(0) }))
      .sort((a, b) => a.firstLetter.localeCompare(b.firstLetter)),
    'firstLetter',
  ),
);

const onFormSubmit = async (event: Event) => {
  event.preventDefault();

  if (!currentVehicle.value) return;

  const currentVehicle_ID = currentVehicle.value.id;

  if (removedShares.value.length > 0) {
    await unShareVehicle(currentVehicle_ID, removedShares.value);
  }

  if (addedShares.value.length > 0) {
    await shareVehicle(
      addedShares.value.map(p => ({
        user_id: p,
        vehicle_id: currentVehicle_ID,
      })),
    );
  }

  console.log('submit', personsModel.value);

  addToast(`Successfully updated shares`, 'success', 2000);
};

const handleOpen = async () => {
  addedShares.value = [];
  removedShares.value = [];

  vehiclesShare.value = vehicleShares.value;

  personsModel.value = users.value.filter(profile =>
    vehicleShares.value.some(pShare => pShare.user_id === profile.user_id),
  );
};

const resetModal = () => {
  addedShares.value = [];
  removedShares.value = [];

  vehiclesShare.value = [];

  drawerRef.value?.close();
};

const checkPerson = (person: Tables<'Profiles'>) => {
  if (personsModel.value.some(p => p.user_id === person.user_id)) {
    personsModel.value = personsModel.value.filter(
      p => p.user_id !== person.user_id,
    );

    if (!vehiclesShare.value.some(p => p.user_id === person.user_id)) {
      addedShares.value = addedShares.value.filter(p => p !== person.user_id);
    } else {
      removedShares.value.push(person.user_id);
    }

    return;
  }

  personsModel.value.push(person);
  if (!vehiclesShare.value.some(p => p.user_id === person.user_id)) {
    addedShares.value.push(person.user_id);

    return;
  }

  removedShares.value = removedShares.value.filter(p => p !== person.user_id);
};

onMounted(async () => {
  const profiles = await getProfiles();

  users.value = profiles;
});

defineExpose({
  drawerRef: drawerRef,
});
</script>

<template>
  <MobileDrawer
    ref="drawerRef"
    :direction="isMd ? 'left' : 'bottom'"
    title="Share Vehicle"
    @shown="handleOpen"
  >
    <template #trigger="{ toggleDrawer }">
      <slot :toggleDrawer="toggleDrawer"></slot>
    </template>

    <ListGroup class="min-h-full flex-grow min-w-80">
      <ListSubGroup
        v-for="(people, group) in groupedPersons"
        :key="group"
        :title="group.toString()"
        sticky
      >
        <ListGroupItem
          as="button"
          size="sm"
          v-for="person in people"
          :key="person.id"
          :title="person.name || ''"
          :imageUrl="
            person.profile_image_url ||
            `https://ui-avatars.com/api/?name=${person.name}`
          "
          :class="{ active: personsModel.some(p => p.id === person.id) }"
          @click="checkPerson(person)"
        >
          <template #endIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              class="fill-current w-3 mx-4"
              :class="{
                hidden: !personsModel.some(p => p.id === person.id),
              }"
            >
              <path
                d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
              />
            </svg>
          </template>
        </ListGroupItem>
      </ListSubGroup>
    </ListGroup>

    <template #actions>
      <button type="button" class="btn btn-sm btn-outline" @click="resetModal">
        Cancel
      </button>
      <button
        type="submit"
        class="btn btn-sm btn-primary"
        @click="onFormSubmit"
        :disabled="!personsModel.length"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          class="fill-current w-3"
        >
          <path
            d="M48 96l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-245.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l245.5 0c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8L320 184c0 13.3-10.7 24-24 24l-192 0c-13.3 0-24-10.7-24-24L80 80 64 80c-8.8 0-16 7.2-16 16zm80-16l0 80 144 0 0-80L128 80zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"
          />
        </svg>
        Save
      </button>
    </template>
  </MobileDrawer>
</template>
