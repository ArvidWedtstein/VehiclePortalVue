import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { FilterKeys } from '@/utils/utils';
import { supabase } from '@/lib/supabaseClient';
import type { Tables, TablesInsert, TablesUpdate } from '@/database.types';

export const useVehiclesStore = defineStore('vehicles', () => {
  const vehicles = ref<Tables<'Vehicles'>[]>([]);
  const currentVehicle = ref<Tables<'Vehicles'> | null>(null);
  const expenses = ref<Tables<'VehicleExpenses'>[]>([]);

  const services = ref<Tables<'VehicleServiceLogs'>[]>([
    {
      id: 26,
      created_at: '2024-10-12 12:36:14.711825+00',
      createby_id: 'e11e43d9-a633-418f-98d5-7bfadd7a5968',
      vehicle_id: 1,
      cost: 1198,
      currency: 'NOK',
      service_provider: 'Self',
      service_date: '2024-10-12 10:00:00+00',
      mileage: 145787,
      notes: 'Oil (Castol Edge 5W-30 LL)and Oil Filter bought at Thansen.',
      type: 'Oil Change',
    },
  ]);

  const setCurrentVehicle = async (pVehicle_ID: Tables<'Vehicles'>['id']) => {
    try {
      console.info('Set Current Vehicle');
      if (!pVehicle_ID) return;

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

  const getVehicles = async <
    Columns extends (keyof Tables<'Vehicles'>[] | '*')[],
  >(
    filters?: FilterKeys<Tables<'Vehicles'>>,
    columns: Columns = ['*'] as Columns,
  ) => {
    try {
      console.info('Get Vehicles');

      const { data, error, status } = await supabase
        .from('myvehicles') // Vehicles
        .select(columns.join(','))
        .match(filters || {})
        .limit(100)
        .returns<Tables<'Vehicles'>[]>();

      if (error && status !== 406) throw error;

      vehicles.value = data ?? [];
    } catch (pErr) {
      console.error(pErr);
    }
  };

  const upsertVehicle = async (
    pData: TablesInsert<'Vehicles'> | TablesUpdate<'Vehicles'>,
  ) => {
    try {
      const { data, error } = await supabase
        .from('Vehicles')
        .upsert(pData)
        .select();

      if (error) throw error;

      const vVehicleIndex = vehicles.value.findIndex(
        ({ id }) => id === data[0].id,
      );

      if (vVehicleIndex !== -1) {
        vehicles.value[vVehicleIndex] = {
          ...vehicles.value[vVehicleIndex],
          ...data[0],
        };

        return;
      }

      vehicles.value.push(...data);
    } catch (pErr) {
      console.error(pErr);
    }
  };

  const shareVehicle = async (users: TablesInsert<'VehicleShares'>[]) => {
    try {
      const { data, error } = await supabase
        .from('VehicleShares')
        .insert(users)
        .select();

      if (error) throw error;

      return data;
    } catch (pErr) {
      console.error(pErr);
    }
  };

  const getExpenses = async <
    Columns extends (keyof Tables<'VehicleExpenses'> | '*')[],
  >(
    filters?: FilterKeys<Tables<'VehicleExpenses'>>,
    columns: Columns = ['*'] as Columns,
  ) => {
    try {
      if (!currentVehicle.value || !currentVehicle.value.id) {
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
        .returns<Tables<'VehicleExpenses'>[]>();

      if (error && status !== 406) throw error;

      expenses.value = data ?? [];
    } catch (pErr) {
      console.error(pErr);
    }
  };

  const getServices = async <
    Columns extends (keyof Tables<'VehicleServiceLogs'> | '*')[],
  >(
    filters?: FilterKeys<Tables<'VehicleServiceLogs'>>,
    columns: Columns = ['*'] as Columns,
  ) => {
    try {
      if (!currentVehicle.value || !currentVehicle.value.id) {
        throw new Error('No Vehicle Selected!');
      }

      if (
        services.value.filter(
          ({ vehicle_id }) => vehicle_id === currentVehicle.value?.id,
        ).length > 0
      ) {
        return;
      }

      const { data, error, status } = await supabase
        .from('VehicleServiceLogs')
        .select(columns.join(','))
        .match(filters || {})
        .eq('vehicle_id', currentVehicle.value.id)
        .limit(100)
        .returns<Tables<'VehicleServiceLogs'>[]>();

      if (error && status !== 406) throw error;

      services.value = data ?? [];
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
    upsertVehicle,
    shareVehicle,
    setCurrentVehicle,
    getExpenses,
    getServices,
  };
});
