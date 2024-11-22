import { ref } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import type { FilterKeys } from '@/utils/utils';
import { supabase } from '@/lib/supabaseClient';
import type { Tables, TablesInsert, TablesUpdate } from '@/database.types';

export const useVehiclesStore = defineStore('vehicles', () => {
  const vehicles = ref<Tables<'Vehicles'>[]>([]);
  const currentVehicle = ref<Tables<'Vehicles'> | null>(null);

  const setCurrentVehicle = async (pVehicle_ID?: Tables<'Vehicles'>['id']) => {
    try {
      console.info('Set Current Vehicle');
      if (!pVehicle_ID) {
        const urlVehicleID = window.location.href.split('/').pop();
        if (!urlVehicleID || Number.isNaN(urlVehicleID)) return;

        pVehicle_ID = parseInt(urlVehicleID);
      }

      if (!vehicles.value.length) {
        await getVehicles({ id: pVehicle_ID });
      }

      const vehicle = vehicles.value.find(({ id }) => id === pVehicle_ID);

      if (!vehicle) {
        throw new Error(`Vehicle with ID: ${pVehicle_ID} was not found`);
      }

      currentVehicle.value = vehicle;

      return currentVehicle;
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
        .upsert(users, { defaultToNull: true })
        .select();

      if (error) throw error;

      return data;
    } catch (pErr) {
      console.error(pErr);
    }
  };

  const unShareVehicle = async (
    vehicle_id: Tables<'VehicleShares'>['vehicle_id'],
    users: TablesInsert<'VehicleShares'>['user_id'][],
  ) => {
    try {
      const { data, error } = await supabase
        .from('VehicleShares')
        .delete()
        .in('user_id', users)
        .eq('vehicle_id', vehicle_id)
        .select();

      if (error) throw error;

      return data;
    } catch (pErr) {
      console.error(pErr);
    }
  };

  const getVehicleShares = async (
    vehicle_ID?: Tables<'VehicleShares'>['vehicle_id'],
  ) => {
    try {
      const currentVehicle_ID = currentVehicle.value?.id || vehicle_ID;

      if (!currentVehicle_ID) {
        return [];
      }

      const { data, error, status } = await supabase
        .from('VehicleShares')
        .select('*')
        .eq('vehicle_id', currentVehicle_ID)
        .returns<Tables<'VehicleShares'>[]>();

      if (error && status !== 406) throw error;

      return data || [];
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }

      return [];
    }
  };

  return {
    vehicles,
    currentVehicle,
    getVehicles,
    upsertVehicle,
    shareVehicle,
    unShareVehicle,
    getVehicleShares,
    setCurrentVehicle,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useVehiclesStore, import.meta.hot));
}
