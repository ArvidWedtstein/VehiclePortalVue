import { computed, reactive, ref, toRef } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';
import type { Tables, TablesInsert, TablesUpdate } from '@/database.types';
import type { FilterKeys } from '@/utils/utils';
import { useVehiclesStore } from './vehicles';

export const useServicesStore = defineStore('services', () => {
  const vehiclesStore = useVehiclesStore();
  const currentVehicle = toRef(vehiclesStore, 'currentVehicle');
  const { setCurrentVehicle } = vehiclesStore;

  const loading = ref(false);

  const servicesCache = reactive(
    new Map<
      Tables<'Vehicles'>['id'],
      Map<Tables<'VehicleServiceLogs'>['id'], Tables<'VehicleServiceLogs'>>
    >(),
  );

  const services = computed(() => {
    if (!currentVehicle.value || !currentVehicle.value.id) {
      setCurrentVehicle();

      return [];
    }

    if (!servicesCache.has(currentVehicle.value.id) && !loading.value) {
      getServices();
    }

    const vehicleServices = servicesCache.get(currentVehicle.value.id);

    return vehicleServices ? Array.from(vehicleServices.values()) : [];
  });

  const getServiceById = (service_id: Tables<'VehicleServiceLogs'>['id']) => {
    if (!currentVehicle.value || !currentVehicle.value.id) {
      return;
    }

    const vehicleServices = servicesCache.get(currentVehicle.value.id);

    if (!vehicleServices) return;

    return vehicleServices.get(service_id);
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

      const currentVehicleServicesCache =
        servicesCache.get(currentVehicle.value.id) || new Map();

      if (data) {
        data.forEach(item => {
          currentVehicleServicesCache.set(item.id, item);
        });
      }

      servicesCache.set(currentVehicle.value.id, currentVehicleServicesCache);
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const upsertService = async (
    serviceLog:
      | TablesInsert<'VehicleServiceLogs'>
      | TablesUpdate<'VehicleServiceLogs'>,
  ) => {
    try {
      if (!currentVehicle.value || !currentVehicle.value.id) {
        throw new Error('No Vehicle Selected!');
      }

      loading.value = true;

      const { data, error } = await supabase
        .from('VehicleServiceLogs')
        .upsert({
          ...serviceLog,
          vehicle_id: currentVehicle.value.id,
        })
        .select();

      if (error) throw error;

      const currentVehicleServicesCache =
        servicesCache.get(currentVehicle.value.id) || new Map();

      data?.forEach(item => {
        currentVehicleServicesCache.set(item.id, item);
      });

      servicesCache.set(currentVehicle.value.id, currentVehicleServicesCache);
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const deleteService = async (
    service_id: Tables<'VehicleServiceLogs'>['id'],
  ) => {
    try {
      if (!currentVehicle.value || !currentVehicle.value.id) {
        throw new Error('No Vehicle Selected!');
      }

      loading.value = true;

      const { error } = await supabase
        .from('VehicleServiceLogs')
        .delete()
        .eq('id', service_id);

      if (error) throw error;

      const currentVehicleServicesCache =
        servicesCache.get(currentVehicle.value.id) || new Map();

      currentVehicleServicesCache.delete(service_id);

      servicesCache.set(currentVehicle.value.id, currentVehicleServicesCache);
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  return {
    services,
    getServices,
    getServiceById,
    upsertService,
    deleteService,
    loading,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useServicesStore, import.meta.hot));
}
