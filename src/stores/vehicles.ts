import { ref } from 'vue';
import { defineStore } from 'pinia';
import { type Vehicle, type Service, type Expense } from './types';

export const useVehiclesStore = defineStore('vehicles', () => {
  const vehicles = ref<Partial<Vehicle>[]>([
    {
      id: 1,
      name: 'Haudi',
      model: 2005,
      make: 'A4 S4',
      imageUrl:
        'https://c4.wallpaperflare.com/wallpaper/163/575/674/cars-audi-wallpaper-preview.jpg',
      odometer_unit: 'kilometer',
    },
    {
      id: 6,
      name: 'Honda',
      model: 1993,
      make: 'Shadow',
      imageUrl:
        'https://wallpapercat.com/w/full/a/1/a/7307-1920x1200-desktop-hd-honda-shadow-background.jpg',
      odometer_unit: 'kilometer',
    },
  ]);

  const expenses = ref<Expense[]>([
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

  const services = ref<Service[]>([
    {
      id: 26,
      created_at: '2024-10-12 12:36:14.711825+00',
      createdby_id: 'e11e43d9-a633-418f-98d5-7bfadd7a5968',
      vehicle_id: 1,
      cost: 1198,
      currency: 'NOK',
      service_provider: 'Self',
      service_date: '2024-10-12 10:00:00+00',
      odometer_reading: 145787,
      notes: 'Oil (Castol Edge 5W-30 LL)and Oil Filter bought at Thansen.',
      type: 'Oil Change',
    },
  ]);

  return { vehicles, expenses, services };
});
