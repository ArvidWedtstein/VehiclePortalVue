import { ref } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';
import type { Tables } from '@/database.types';
import type { FilterKeys } from '@/utils/utils';
import { useVehiclesStore } from './vehicles';

export const useServicesStore = defineStore('services', () => {
  const { currentVehicle } = useVehiclesStore();
  const services = ref<Tables<'VehicleServiceLogs'>[]>([]);
  const servicesCache = new Map<number, Tables<'VehicleServiceLogs'>[]>();

  const getServices = async <
    Columns extends (keyof Tables<'VehicleServiceLogs'> | '*')[],
  >(
    filters?: FilterKeys<Tables<'VehicleServiceLogs'>>,
    columns: Columns = ['*'] as Columns,
  ) => {
    try {
      if (!currentVehicle || !currentVehicle.id) {
        throw new Error('No Vehicle Selected!');
      }

      if (
        services.value.filter(
          ({ vehicle_id }) => vehicle_id === currentVehicle.id,
        ).length > 0 ||
        servicesCache.has(currentVehicle.id)
      )
        return;

      const { data, error, status } = await supabase
        .from('VehicleServiceLogs')
        .select(columns.join(','))
        .match(filters || {})
        .eq('vehicle_id', currentVehicle.id)
        .limit(100)
        .returns<Tables<'VehicleServiceLogs'>[]>();

      if (error && status !== 406) throw error;

      servicesCache.set(currentVehicle.id, data ?? []);
      services.value = data ?? [];
    } catch (pErr) {
      console.error(pErr);
    }
  };

  return { services, getServices };
});
