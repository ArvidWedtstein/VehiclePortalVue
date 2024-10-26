<script setup lang="ts">
import { useVehiclesStore } from '@/stores/vehicles';
import LineChart from '@/components/LineChart.vue';
import { groupBy } from '@/utils/utils';
import { computed } from 'vue';
const props = defineProps({
  id: String,
});

const { vehicles, expenses } = useVehiclesStore();

const vehicle = vehicles.find(
  ({ id: vehicle_id }) => vehicle_id === parseInt(props.id || ''),
);

const fuelData = computed(() => {
  const dataPoints = [];

  for (let i = 1; i < expenses.length; i++) {
    const current = expenses[i];
    const previous = expenses[i - 1];

    // Calculate distance traveled
    const distance = current.odometer_reading - previous.odometer_reading;

    // Calculate fuel economy in liters per 100 km
    const fuelUsed = current.amount; // In liters
    const fuelEconomy = (fuelUsed / distance) * 100; // L/100km

    dataPoints.push({
      month: new Date(current.expense_date).getMonth(),
      fuelEconomy: Math.round(fuelEconomy * 100) / 100,
    });
  }

  console.log(Object.values(groupBy(dataPoints, 'month')));

  return [0]; // Object.values(groupBy(dataPoints, 'month')).map(p => p[0].fuelEconomy);
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
