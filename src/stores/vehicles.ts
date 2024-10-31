import { ref } from 'vue';
import { defineStore } from 'pinia';
import { type Vehicle, type Service, type Expense } from '../types';
import type { FilterKeys } from '@/utils/utils';
import { supabase } from '@/lib/supabaseClient';

export const useVehiclesStore = defineStore('vehicles', () => {
  const vehicles = ref<Vehicle[]>([]);
  const currentVehicle = ref<Vehicle | null>(null);

  const expenses = ref<Expense[]>([]);

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

  const setCurrentVehicle = async (pVehicle_ID: Vehicle['id']) => {
    try {
      console.info('Set Current Vehicle');

      if (!vehicles.value.length) {
        await getVehicles({ id: pVehicle_ID });
      }

      const vehicle = vehicles.value.find(({ id }) => id === pVehicle_ID);

      if (!vehicle) {
        throw new Error(`Vehicle with ID: ${pVehicle_ID} was not found`);
      }

      currentVehicle.value = vehicle;
    } catch (pErr) {
      console.error(pErr);
    }
  };

  const getVehicles = async <Columns extends (keyof Vehicle | '*')[]>(
    filters?: FilterKeys<Vehicle>,
    columns: Columns = ['*'] as Columns,
  ) => {
    try {
      console.info('Get Vehicles');

      const { data, error, status } = await supabase
        .from('Vehicles')
        .select(columns.join(','))
        .match(filters || {})
        .limit(100)
        .returns<Vehicle[]>();

      if (error && status !== 406) throw error;

      vehicles.value = data ?? [];
    } catch (pErr) {
      console.error(pErr);
    }
  };

  const getExpenses = async <Columns extends (keyof Expense | '*')[]>(
    filters?: FilterKeys<Expense>,
    columns: Columns = ['*'] as Columns,
  ) => {
    try {
      if (!currentVehicle.value) {
        throw new Error('No Vehicle Selected!');
      }

      if (
        expenses.value.filter(
          ({ vehicle_id }) => vehicle_id === currentVehicle.value?.id,
        ).length > 0
      )
        return;

      const { data, error, status } = await supabase
        .from('VehicleExpenses')
        .select(columns.join(','))
        .match(filters || {})
        .eq('vehicle_id', currentVehicle.value.id)
        .limit(100)
        .returns<Expense[]>();

      if (error && status !== 406) throw error;

      expenses.value = data ?? [];
    } catch (pErr) {
      console.error(pErr);
    }
  };

  return {
    vehicles,
    currentVehicle,
    expenses,
    services,
    getVehicles,
    setCurrentVehicle,
    getExpenses,
  };
});
