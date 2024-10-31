<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import ExpenseTab from '@/components/vehicles/expenses/ExpenseTab.vue';
import ServiceTab from '@/components/vehicles/services/ServiceTab.vue';
import { useRouter } from 'vue-router';
import { onMounted, toRefs } from 'vue';
// import CalendarInput from '@/components/general/form/CalendarInput.vue';
const props = defineProps({
  id: String,
});

const router = useRouter();
const vehiclesStore = useVehiclesStore();
const { currentVehicle } = toRefs(vehiclesStore);
const { setCurrentVehicle } = vehiclesStore;

onMounted(async () => {
  await setCurrentVehicle(parseInt(props.id || ''));
});
</script>

<template>
  <div
    v-if="currentVehicle"
    class="relative rounded-lg border overflow-hidden bg-base-300 p-4 gap-2"
  >
    <img
      :src="currentVehicle.imageUrl"
      class="absolute w-1/3 h-full left-0 top-0 bottom-0 object-cover"
      loading="lazy"
    />
    <div class="absolute top-0 left-0 w-1/3 p-2">
      <div class="card bg-neutral bg-opacity-50 rounded-md text-white">
        <div class="card-body">
          <button
            class="btn btn-sm btn-secondary btn-square"
            @click="router.back()"
          >
            ⬅
          </button>
          <h2 class="card-title">
            {{ currentVehicle.name }} {{ currentVehicle.make }}
          </h2>
          <p>tralala</p>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-3">
      <div class="col-start-2 col-span-2 p-4">
        <div role="tablist" class="tabs tabs-bordered">
          <input
            type="radio"
            name="vehicle_tabs"
            role="tab"
            class="tab"
            aria-label="Expenses"
            :checked="true"
          />
          <div role="tabpanel" class="tab-content p-10">
            <ExpenseTab :id="parseInt(id || '')" />
          </div>

          <input
            type="radio"
            name="vehicle_tabs"
            role="tab"
            class="tab"
            aria-label="Service"
          />
          <div role="tabpanel" class="tab-content p-10">
            <ServiceTab :id="parseInt(id || '')" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
