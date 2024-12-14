import { ref, toRef } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';
import type { Tables, TablesInsert, TablesUpdate } from '@/database.types';
import type { FilterKeys } from '@/utils/utils';
import { useVehiclesStore } from './vehicles';

export const useServicesStore = defineStore('services', () => {
  const vehiclesStore = useVehiclesStore();
  const currentVehicle = toRef(vehiclesStore, 'currentVehicle');

  const services = ref<Tables<'VehicleServiceLogs'>[]>([]);
  const servicesCache = new Map<number, Tables<'VehicleServiceLogs'>[]>();

  const loading = ref(false);

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

      // TODO: find better solution
      // if (
      //   services.value.filter(
      //     ({ vehicle_id }) => vehicle_id === currentVehicle.value?.id,
      //   ).length > 0 ||
      //   servicesCache.has(currentVehicle.value.id)
      // )
      //   return;

      loading.value = true;

      const { data, error, status } = await supabase
        .from('VehicleServiceLogs')
        .select(columns.join(','))
        .match(filters || {})
        .eq('vehicle_id', currentVehicle.value.id)
        .limit(100)
        .order('date', { ascending: false })
        .returns<Tables<'VehicleServiceLogs'>[]>();

      if (error && status !== 406) throw error;

      servicesCache.set(currentVehicle.value.id, data ?? []);
      services.value = data ?? [];
    } catch (pErr) {
      console.error(pErr);
    } finally {
      loading.value = false;
    }
  };

  const upsertService = async (
    pData:
      | TablesInsert<'VehicleServiceLogs'>
      | TablesUpdate<'VehicleServiceLogs'>,
  ) => {
    try {
      loading.value = true;

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
    } finally {
      loading.value = false;
    }
  };

  const deleteService = async (
    service_id: Tables<'VehicleServiceLogs'>['id'],
  ) => {
    try {
      loading.value = true;

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
    } finally {
      loading.value = false;
    }
  };

  return { services, getServices, upsertService, deleteService, loading };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useServicesStore, import.meta.hot));
}
