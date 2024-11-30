import { ref, toRef } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';
import type { Tables } from '@/database.types';
import type { FilterKeys } from '@/utils/utils';
import { useVehiclesStore } from './vehicles';

export const useChangelogStore = defineStore('changelog', () => {
  const vehiclesStore = useVehiclesStore();
  const currentVehicle = toRef(vehiclesStore, 'currentVehicle');

  const changelog = ref<Tables<'Changelog'>[]>([]);
  const changelogCache = new Map<number, Tables<'Changelog'>[]>();

  const getChangelog = async <
    Columns extends (keyof Tables<'Changelog'> | '*')[],
  >(
    filters?: FilterKeys<Tables<'Changelog'>>,
    columns: Columns = ['*'] as Columns,
  ) => {
    try {
      if (!currentVehicle.value || !currentVehicle.value.id) {
        throw new Error('No Vehicle Selected!');
      }

      if (changelogCache.has(currentVehicle.value.id)) return;

      const { data, error, status } = await supabase
        .from('Changelog')
        .select(columns.join(','))
        .match(filters || {})
        .eq('vehicle_id', currentVehicle.value.id)
        .limit(100)
        .returns<Tables<'Changelog'>[]>();

      if (error && status !== 406) throw error;

      changelogCache.set(currentVehicle.value.id, data ?? []);
      changelog.value = data ?? [];
    } catch (pErr) {
      console.error(pErr);
    }
  };

  return { changelog, getChangelog };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChangelogStore, import.meta.hot));
}
