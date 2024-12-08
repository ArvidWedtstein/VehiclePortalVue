<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { computed, onMounted, ref, toRef } from 'vue';
import FormDialog from '@/components/general/modal/FormDialog.vue';
import ListGroupItem from '../general/list/ListGroupItem.vue';
import ListSubGroup from '../general/list/ListSubGroup.vue';
import ListGroup from '../general/list/ListGroup.vue';
import { groupBy } from '@/utils/utils';
import type { Tables } from '@/database.types';
import { useProfilesStore } from '@/stores/profiles';
import { toast } from '@/lib/toastManager';

const modalRef = ref();

const vehiclesStore = useVehiclesStore();
const { getProfiles } = useProfilesStore();

const currentVehicle = toRef(vehiclesStore, 'currentVehicle');
const { shareVehicle, unShareVehicle, getVehicleShares } = vehiclesStore;

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

  const currentVehicle_ID = currentVehicle.value?.id;
  if (!currentVehicle_ID) return;

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

  toast.triggerToast(`Successfully updated shares`, 'success', 1000);
};

const handleOpen = async () => {
  addedShares.value = [];
  removedShares.value = [];

  modalRef.value.modalRef.showModal();

  const vehicleShares = await getVehicleShares(currentVehicle.value?.id);

  vehiclesShare.value = vehicleShares;

  personsModel.value = users.value.filter(profile =>
    vehicleShares?.some(pShare => pShare.user_id === profile.user_id),
  );
};

const resetModal = () => {
  addedShares.value = [];
  removedShares.value = [];

  vehiclesShare.value = [];
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

defineExpose({ modalRef: modalRef });
</script>

<template>
  <FormDialog
    id="vehicleShareModal"
    ref="modalRef"
    :title="`Share '${currentVehicle?.name}'`"
    @submit="onFormSubmit"
    @open="handleOpen"
    @close="resetModal"
  >
    <ListGroup class="max-h-96 mt-2">
      <ListSubGroup
        v-for="(people, group) in groupedPersons"
        :key="group"
        :title="group.toString()"
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
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              class="fill-current w-3 mx-4"
              :class="{ hidden: !personsModel.some(p => p.id === person.id) }"
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
      <button
        class="btn btn-sm btn-outline"
        value="cancel"
        formmethod="dialog"
        formnovalidate
      >
        Close
      </button>

      <button type="submit" class="btn btn-sm btn-primary ms-1" value="submit">
        Ok
      </button>
    </template>
  </FormDialog>
</template>
