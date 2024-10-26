<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import LineChart from '@/components/LineChart.vue';
import { computed } from 'vue';
const props = defineProps({
  id: String,
});

const { vehicles, expenses } = useVehiclesStore();

const vehicle = vehicles.find(
  ({ id: vehicle_id }) => vehicle_id === parseInt(props.id || ''),
);

const fuelData = computed(() => {
  return expenses.map(p => p.amount);
});
</script>

<template>
  <div v-if="vehicle" class="hero bg-base-200 min-h-screen">
    <div class="hero-content flex-col lg:flex-row">
      <img :src="vehicle.imageUrl" class="max-w-sm rounded-lg shadow-2xl" />
      <div>
        <h1 class="text-5xl font-bold">{{ vehicle.name }}</h1>
        <p class="py-6">
          {{ vehicle.model }}
        </p>
        <!-- :data="[10, 25, 40, 30, 50, 35, 70, 40, 20, 50, 80, 30]" -->
        <LineChart
          :data="fuelData"
          :width="400"
          :height="400"
          :xLabels="[
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ]"
          :yTicks="[0, 20, 40, 60, 80, 100]"
          animate
        />
        <button class="btn btn-primary">Get Started</button>
      </div>
    </div>
  </div>
</template>
