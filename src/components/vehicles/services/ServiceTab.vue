<script setup lang="ts">
import LineChart from '@/components/LineChart.vue';
import ServiceModal from './ServiceModal.vue';

const props = defineProps({
  id: Number,
});

// const fuelData = computed(() => {
//   const dataPoints = [];

//   for (let i = 1; i < expenses.length; i++) {
//     const current = expenses[i];
//     const previous = expenses[i - 1];

//     // Calculate distance traveled
//     const distance = current.odometer_reading - previous.odometer_reading;

//     // Calculate fuel economy in liters per 100 km
//     const fuelUsed = current.amount; // In liters
//     const fuelEconomy = (fuelUsed / distance) * 100; // L/100km

//     dataPoints.push({
//       month: new Date(current.expense_date).getMonth(),
//       fuelEconomy: Math.round(fuelEconomy * 100) / 100,
//     });
//   }

//   console.log(Object.values(groupBy(dataPoints, 'month')));

//   return [0]; // Object.values(groupBy(dataPoints, 'month')).map(p => p[0].fuelEconomy);
// });
</script>

<template>
  <ServiceModal v-if="props.id" :vehicle_id="props.id" />

  <button class="btn" onclick="serviceModal.showModal()">Add Service</button>
  <!-- :data="fuelData" -->
  <LineChart
    :data="[10, 25, 40, 30, 50, 35, 70, 40, 20, 50, 80, 30]"
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
</template>
