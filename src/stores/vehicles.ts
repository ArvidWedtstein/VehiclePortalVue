import { computed, reactive, ref } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { groupBy, type FilterKeys } from '@/utils/utils';
import { supabase } from '@/lib/supabaseClient';
import type { Tables, TablesInsert, TablesUpdate } from '@/database.types';
import { useRoute } from 'vue-router';

export type VehicleShareWithProfile = Tables<'VehicleShares'> & {
  Profiles: Pick<Tables<'Profiles'>, 'profile_image_url' | 'name'>;
};

export const useVehiclesStore = defineStore('vehicles', () => {
  // TODO: remove eu_control_date column?
  // Replace with system for registering own custom service_dates?
  const vehiclesCache = reactive(
    new Map<Tables<'Vehicles'>['id'], Tables<'Vehicles'>>(),
  );

  const currentVehicleId = ref<Tables<'Vehicles'>['id'] | null>(null);

  const loading = ref(false);

  const vehicles = computed(() => {
    if (vehiclesCache.size < 2 && !loading.value) {
      getVehicles();

      return [];
    }

    return Array.from(vehiclesCache.values());
  });

  const currentVehicle = computed(() => {
    const id = currentVehicleId.value;
    if (!id) return null;

    const vehicle = vehiclesCache.get(id);

    if (!vehicle) {
      getVehicles({ id: id });
      return null;
    }

    return vehicle;
  });

  const setCurrentVehicle = async (vehicle_id?: Tables<'Vehicles'>['id']) => {
    try {
      const route = useRoute();

      if (!vehicle_id) {
        const entryIndex = Object.entries(route.params).findIndex(
          ([k]) => k === 'vehicle_id',
        );
        if (entryIndex < 0) return;

        const value = Object.values(route.params)[entryIndex];
        const urlVehicle_id = Array.isArray(value) ? value.pop() : value;

        if (!urlVehicle_id || Number.isNaN(urlVehicle_id)) return;

        vehicle_id = parseInt(urlVehicle_id);
      }

      if (!vehiclesCache.has(vehicle_id)) {
        await getVehicles({ id: vehicle_id });
      }

      currentVehicleId.value = vehicle_id;
    } catch (err) {
      console.error(err);
    }
  };

  const getVehicles = async <
    Columns extends (keyof Tables<'Vehicles'>[] | '*')[],
  >(
    filters?: FilterKeys<Tables<'Vehicles'>>,
    columns: Columns = ['*'] as Columns,
  ) => {
    try {
      loading.value = true;

      const { data, error, status } = await supabase
        .from('Vehicles')
        .select(columns.join(','))
        .match(filters || {})
        .limit(100)
        .returns<Tables<'Vehicles'>[]>();

      if (error && status !== 406) throw error;

      data?.forEach(vehicle => {
        vehiclesCache.set(vehicle.id, vehicle);
      });
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const upsertVehicle = async (
    vehicle: TablesInsert<'Vehicles'> | TablesUpdate<'Vehicles'>,
  ) => {
    try {
      const { data, error } = await supabase
        .from('Vehicles')
        .upsert(vehicle)
        .returns<Tables<'Vehicles'>[]>()
        .select();

      if (error) throw error;

      data?.forEach(vehicle => {
        vehiclesCache.set(vehicle.id, vehicle);
      });
    } catch (err) {
      console.error(err);
    }
  };

  // -- VehicleShares --
  const sharesLoading = ref(false);

  const vehiclesSharesCache = new Map<
    Tables<'Vehicles'>['id'],
    Map<VehicleShareWithProfile['id'], VehicleShareWithProfile>
  >();

  const vehicleShares = computed(() => {
    if (currentVehicleId.value === null) {
      return [];
    }

    if (
      !vehiclesSharesCache.has(currentVehicleId.value) &&
      !sharesLoading.value
    ) {
      getVehicleShares(currentVehicleId.value);
    }

    const currentVehicleShares = vehiclesSharesCache.get(
      currentVehicleId.value,
    );

    return currentVehicleShares
      ? Array.from(currentVehicleShares.values())
      : [];
  });

  const shareVehicle = async (users: TablesInsert<'VehicleShares'>[]) => {
    try {
      const { data, error } = await supabase
        .from('VehicleShares')
        .upsert(users, { defaultToNull: true })
        .select(
          `
          *,
          Profiles (
            name,
            profile_image_url
          )  
        `,
        );

      if (error) throw error;

      const groupedShares = groupBy(data ?? [], 'vehicle_id');

      Object.entries(groupedShares).forEach(([vehicle_id, shares]) => {
        const vehicleShareCache =
          vehiclesSharesCache.get(parseInt(vehicle_id)) || new Map();

        shares?.forEach(share => {
          vehicleShareCache.set(share.id, share);
        });

        vehiclesSharesCache.set(parseInt(vehicle_id), vehicleShareCache);
      });

      return data;
    } catch (err) {
      console.error(err);
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
        .select(
          `
          *,
          Profiles (
            name,
            profile_image_url
          )  
        `,
        )
        .returns<Array<VehicleShareWithProfile>>();

      if (error) throw error;

      const vehicleShareCache =
        vehiclesSharesCache.get(vehicle_id) || new Map();

      data?.forEach(share => {
        vehicleShareCache.delete(share.id);
      });

      vehiclesSharesCache.set(vehicle_id, vehicleShareCache);

      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const getVehicleShares = async (
    vehicle_id?: Tables<'VehicleShares'>['vehicle_id'],
  ) => {
    try {
      const currentVehicle_id = currentVehicle.value
        ? currentVehicle.value.id
        : vehicle_id;

      if (!currentVehicle_id) {
        return [];
      }

      sharesLoading.value = true;

      const { data, error, status } = await supabase
        .from('VehicleShares')
        .select(
          `
          *,
          Profiles (
            name,
            profile_image_url
          )  
        `,
        )
        .eq('vehicle_id', currentVehicle_id)
        .returns<Array<VehicleShareWithProfile>>();

      if (error && status !== 406) throw error;

      const currentVehicleShareCache =
        vehiclesSharesCache.get(currentVehicle_id) || new Map();

      data?.forEach(share => {
        currentVehicleShareCache.set(share.id, share);
      });

      vehiclesSharesCache.set(currentVehicle_id, currentVehicleShareCache);

      return data || [];
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }

      return [];
    } finally {
      sharesLoading.value = false;
    }
  };

  return {
    vehicles,
    currentVehicle,
    getVehicles,
    upsertVehicle,
    vehicleShares,
    shareVehicle,
    unShareVehicle,
    getVehicleShares,
    setCurrentVehicle,
    loading,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useVehiclesStore, import.meta.hot));
}
