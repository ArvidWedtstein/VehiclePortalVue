<script setup lang="ts">
import VehicleItem from '../vehicles/VehicleItem.vue';

const vehicles = [
  {
    id: 1,
    name: 'Haudi',
    model: 2005,
    make: 'A4 S4',
    imageUrl:
      'https://c4.wallpaperflare.com/wallpaper/163/575/674/cars-audi-wallpaper-preview.jpg',
  },
  {
    id: 6,
    name: 'Honda',
    model: 1993,
    make: 'Shadow',
    imageUrl:
      'https://wallpapercat.com/w/full/a/1/a/7307-1920x1200-desktop-hd-honda-shadow-background.jpg',
  },
];
</script>

<template>
  <div class="py-24 sm:py-32">
    <div class="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
      <div class="max-w-xl">
        <h2
          class="text-pretty text-3xl font-semibold tracking-tight dark:text-white text-gray-900 sm:text-4xl"
        >
          Your Vehicles
        </h2>
        <p class="mt-6 text-lg leading-8 dark:text-gray-300 text-gray-600">
          Tralala
        </p>
      </div>
      <ul
        role="list"
        class="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2"
      >
        <li v-for="vehicle in vehicles" :key="vehicle.name">
          <VehicleItem :vehicle="vehicle" />
        </li>
      </ul>
    </div>
  </div>
</template>
