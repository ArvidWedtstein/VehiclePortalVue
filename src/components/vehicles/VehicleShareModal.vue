<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import { ref, toRef } from 'vue';
import FormDialog from '@/components/general/modal/FormDialog.vue';
// import ListItem from '../general/list/ListItem.vue';
// import ListSubGroup from '../general/list/ListSubGroup.vue';
// import ListGroup from '../general/list/ListGroup.vue';
// import { groupBy } from '@/utils/utils';
import AutoComplete from '../general/form/AutoComplete.vue';

const modalRef = ref();

const vehiclesStore = useVehiclesStore();

const currentVehicle = toRef(vehiclesStore, 'currentVehicle');

const people = [
  {
    id: 1,
    name: 'Leanne Graham',
    email: 'Sincere@april.biz',
    imageUrl: 'https://via.placeholder.com/150/92c952',
  },
  {
    id: 2,
    name: 'Ervin Howell',
    email: 'Shanna@melissa.tv',
    imageUrl: 'https://via.placeholder.com/150/771796',
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    email: 'Nathan@yesenia.net',
    imageUrl: 'https://via.placeholder.com/150/24f355',
  },
  {
    id: 4,
    name: 'Patricia Lebsack',
    email: 'Julianne.OConner@kory.org',
    imageUrl: 'https://via.placeholder.com/150/d32776',
  },
  {
    id: 5,
    name: 'Chelsey Dietrich',
    email: 'Lucio_Hettinger@annie.ca',
    imageUrl: 'https://via.placeholder.com/150/f66b97',
  },
  {
    id: 6,
    name: 'Mrs. Dennis Schulist',
    email: 'Karley_Dach@jasper.info',
    imageUrl: 'https://via.placeholder.com/150/56a8c2',
  },
  {
    id: 7,
    name: 'Kurtis Weissnat',
    email: 'Telly.Hoeger@billy.biz',
    imageUrl: 'https://via.placeholder.com/150/b0f7cc',
  },
  {
    id: 8,
    name: 'Nicholas Runolfsdottir V',
    email: 'Sherwood@rosamond.me',
    imageUrl: 'https://via.placeholder.com/150/54176f',
  },
  {
    id: 9,
    name: 'Glenna Reichert',
    email: 'Chaim_McDermott@dana.io',
    imageUrl: 'https://via.placeholder.com/150/51aa97',
  },
  {
    id: 10,
    name: 'Clementina DuBuque',
    email: 'Rey.Padberg@karina.biz',
    imageUrl: 'https://via.placeholder.com/150/810b14',
  },
];

const personsModel = ref<typeof people>([]);
// const groupedPersons = groupBy(
//   people.map(p => ({ ...p, firstLetter: p.name.charAt(0) })),
//   'firstLetter',
// );

const onFormSubmit = () => {
  console.log('submit');
};

const handleOpen = () => {
  modalRef.value.modalRef.showModal();
};

defineExpose({ modalRef: modalRef, open: handleOpen });
</script>

<template>
  <FormDialog
    id="vehicleShareModal"
    ref="modalRef"
    :title="`Share '${currentVehicle?.name}'`"
    @submit="onFormSubmit"
  >
    <AutoComplete
      label="Person"
      :multiple="true"
      :options="people"
      v-model="personsModel"
      :getOptionLabel="opt => opt.name"
      :isOptionEqualToValue="(opt, val) => opt.id === val.id"
    />

    <pre>{{
      JSON.stringify(
        Array.isArray(personsModel)
          ? personsModel.map(p => p.name)
          : personsModel['name'],
        null,
        2,
      )
    }}</pre>
    <!-- <ListGroup class="h-64">
      <ListSubGroup
        v-for="(people, group) in groupedPersons"
        :key="group"
        :title="group.toString()"
      >
        <ListItem
          v-for="person in people"
          :key="person.id"
          :title="person.name"
          :subtitle="person.email"
          :imageUrl="person.imageUrl"
        />
      </ListSubGroup>
    </ListGroup> -->

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
