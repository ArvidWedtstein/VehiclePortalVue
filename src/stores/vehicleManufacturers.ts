import { computed, reactive, ref, toRef } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';
import type { Tables } from '@/database.types';
import type { FilterKeys } from '@/utils/utils';
import { useSessionStore } from './general/userSession';

export const useVehicleManufacturersStore = defineStore(
  'vehicleManufacturers',
  () => {
    const sessionStore = useSessionStore();
    const isAuthenticated = toRef(sessionStore, 'isAuthenticated');

    const loading = ref(false);

    const vehicleManufacturersCache = reactive(
      new Map<
        Tables<'VehicleManufacturers'>['id'],
        Tables<'VehicleManufacturers'>
      >(),
    );

    const vehicleManufacturers = computed(() => {
      if (
        !vehicleManufacturersCache.size &&
        !loading.value &&
        isAuthenticated.value
      ) {
        getVehicleManufacturers();
      }

      return Array.from(vehicleManufacturersCache.values());
    });

    const getVehicleManufacturers = async <
      Columns extends (keyof Tables<'VehicleManufacturers'> | '*')[],
    >(
      filters?: FilterKeys<Tables<'VehicleManufacturers'>>,
      columns: Columns = ['*'] as Columns,
    ) => {
      try {
        if (!isAuthenticated.value) return;
        loading.value = true;

        const { data, error, status } = await supabase
          .from('VehicleManufacturers')
          .select(columns.join(','))
          .match(filters || {})
          .neq('sort_order', 0)
          //   .order('sort_order', { ascending: false })
          .returns<Tables<'VehicleManufacturers'>[]>();

        if (error && status !== 406) throw error;

        if (data) {
          data.forEach(item => {
            vehicleManufacturersCache.set(item.id, item);
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    return { vehicleManufacturers, getVehicleManufacturers, loading };
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useVehicleManufacturersStore, import.meta.hot),
  );
}
