import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useVehiclesStore = defineStore('vehicles', () => {
  const vehicles = ref([
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
  ]);

  const expenses = ref([
    {
      id: 11,
      created_at: '2024-05-12 20:30:38.485063+00',
      createdby_id: 'e11e43d9-a633-418f-98d5-7bfadd7a5968',
      vehicle_id: 1,
      expense_date: '2023-11-21 05:47:51+00',
      expense_type: 'diesel',
      amount: 56.14,
      odometer_reading: 137378,
      notes: 'shell',
      cost: 1189.61,
      currency: 'NOK',
      unit: 'liter',
      price_per_litre: 21.1901,
    },
    {
      id: 9,
      created_at: '2024-05-12 20:30:38.485063+00',
      createdby_id: 'e11e43d9-a633-418f-98d5-7bfadd7a5968',
      vehicle_id: 1,
      expense_date: '2023-12-19 05:22:20+00',
      expense_type: 'diesel',
      amount: 40.71,
      odometer_reading: 137872,
      notes: 'shell',
      cost: 821.53,
      currency: 'NOK',
      unit: 'liter',
      price_per_litre: 20.1801,
    },
  ]);

  return { vehicles, expenses };
});
