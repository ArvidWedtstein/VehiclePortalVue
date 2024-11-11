<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { computed, onMounted, ref, toRef } from 'vue';
import FormDialog from '@/components/general/modal/FormDialog.vue';
import ListGroupItem from '../general/list/ListGroupItem.vue';
import ListSubGroup from '../general/list/ListSubGroup.vue';
import ListGroup from '../general/list/ListGroup.vue';
import { groupBy } from '@/utils/utils';
import type { Tables, TablesInsert } from '@/database.types';
import { useProfilesStore } from '@/stores/profiles';

// TODO: get VehicleShares to check which users already have this vehicle shared
const modalRef = ref();

const vehiclesStore = useVehiclesStore();
const { getProfiles } = useProfilesStore();

const currentVehicle = toRef(vehiclesStore, 'currentVehicle');
const { shareVehicle } = vehiclesStore;

const users = ref<Tables<'Profiles'>[]>([]);

const personsModel = ref<Tables<'Profiles'>[]>([]);

const groupedPersons = computed(() =>
  groupBy(
    users.value
      .map(p => ({ ...p, firstLetter: (p.name || '').charAt(0) }))
      .sort((a, b) => a.firstLetter.localeCompare(b.firstLetter)),
    'firstLetter',
  ),
);

const onFormSubmit = async (event: Event) => {
  event.preventDefault();

  const currentVehicle_ID = currentVehicle.value?.id;
  if (!currentVehicle_ID) return;

  const shares: TablesInsert<'VehicleShares'>[] = personsModel.value.map(
    pUser => ({
      user_id: pUser.user_id,
      vehicle_id: currentVehicle_ID,
      readonly: true,
    }),
  );

  const data = await shareVehicle(shares);
  console.log('submit', personsModel.value, data);
};

const handleOpen = () => {
  modalRef.value.modalRef.showModal();
};

const checkPerson = (person: Tables<'Profiles'>) => {
  if (personsModel.value.some(p => p.id === person.id)) {
    personsModel.value = personsModel.value.filter(p => p.id !== person.id);

    return;
  }

  personsModel.value.push(person);
};

onMounted(async () => {
  const profiles = await getProfiles();

  users.value = profiles || [];
});

defineExpose({ modalRef: modalRef, open: handleOpen });
</script>

<template>
  <FormDialog
    id="vehicleShareModal"
    ref="modalRef"
    :title="`Share '${currentVehicle?.name}'`"
    @submit="onFormSubmit"
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
          :imageUrl="person.profile_image_url || ''"
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
