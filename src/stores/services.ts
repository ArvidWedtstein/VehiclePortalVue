import { ref, toRef } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';
import type { Tables, TablesInsert, TablesUpdate } from '@/database.types';
import type { FilterKeys } from '@/utils/utils';
import { useVehiclesStore } from './vehicles';

export const useServicesStore = defineStore('services', () => {
  const vehiclesStore = useVehiclesStore();
  const currentVehicle = toRef(vehiclesStore, 'currentVehicle');
  const { setCurrentVehicle } = vehiclesStore;

  const services = ref<Tables<'VehicleServiceLogs'>[]>([]);
  const servicesCache = new Map<number, Tables<'VehicleServiceLogs'>[]>();

  const getServices = async <
    Columns extends (keyof Tables<'VehicleServiceLogs'> | '*')[],
  >(
    filters?: FilterKeys<Tables<'VehicleServiceLogs'>>,
    columns: Columns = ['*'] as Columns,
  ) => {
    try {
      console.log('currenmt', currentVehicle);

      if (!currentVehicle.value || !currentVehicle.value.id) {
        setCurrentVehicle();
        // throw new Error('No Vehicle Selected!');
        return;
      }

      if (
        services.value.filter(
          ({ vehicle_id }) => vehicle_id === currentVehicle.value?.id,
        ).length > 0 ||
        servicesCache.has(currentVehicle.value.id)
      )
        return;

      const { data, error, status } = await supabase
        .from('VehicleServiceLogs')
        .select(columns.join(','))
        .match(filters || {})
        .eq('vehicle_id', currentVehicle.value.id)
        .limit(100)
        .returns<Tables<'VehicleServiceLogs'>[]>();

      if (error && status !== 406) throw error;

      servicesCache.set(currentVehicle.value.id, data ?? []);
      services.value = data ?? [];
    } catch (pErr) {
      console.error(pErr);
    }
  };

  const upsertService = async (
    pData:
      | TablesInsert<'VehicleServiceLogs'>
      | TablesUpdate<'VehicleServiceLogs'>,
  ) => {
    try {
      const { data, error } = await supabase
        .from('VehicleServiceLogs')
        .upsert({
          ...pData,
          vehicle_id: currentVehicle.value?.id || -1,
        })
        .select();

      if (error) throw error;

      const vServiceIndex = services.value.findIndex(
        ({ id }) => id === data[0].id,
      );

      if (vServiceIndex !== -1) {
        services.value[vServiceIndex] = {
          ...services.value[vServiceIndex],
          ...data[0],
        };

        return;
      }

      services.value.push(...data);
    } catch (pErr) {
      console.error(pErr);
    }
  };

  const deleteService = async (
    service_id: Tables<'VehicleServiceLogs'>['id'],
  ) => {
    try {
      const { error } = await supabase
        .from('VehicleServiceLogs')
        .delete()
        .eq('id', service_id);

      if (error) throw error;

      services.value = services.value.filter(({ id }) => id !== service_id);
      servicesCache.set(
        currentVehicle.value?.id || -1,
        servicesCache
          .get(currentVehicle.value?.id || 0)
          ?.filter(({ id }) => id !== service_id) || [],
      );
    } catch (error) {
      console.error(error);
    }
  };

  return { services, getServices, upsertService, deleteService };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useServicesStore, import.meta.hot));
}
