import { ref, toRef } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';
import type { Tables } from '@/database.types';
import type { FilterKeys } from '@/utils/utils';
import { useVehiclesStore } from './vehicles';
import { useProfilesStore } from './profiles';

export const useChangelogStore = defineStore('Changelog', () => {
  const vehiclesStore = useVehiclesStore();
  const currentVehicle = toRef(vehiclesStore, 'currentVehicle');

  const profilesStore = useProfilesStore();
  const profiles = toRef(profilesStore, 'profilesCache');

  const changelog = ref<Tables<'changelog_with_profile'>[]>([]);
  const changelogCache = new Map<number, Tables<'changelog_with_profile'>[]>();

  const getChangelog = async <
    Columns extends (keyof Tables<'changelog_with_profile'> | '*')[],
  >(
    filters: FilterKeys<Tables<'changelog_with_profile'>> = {},
    columns: Columns = ['*'] as Columns,
  ) => {
    try {
      if (!currentVehicle.value || !currentVehicle.value.id) {
        throw new Error('No Vehicle Selected!');
      }

      if (
        changelogCache.has(currentVehicle.value.id) &&
        (changelogCache.get(currentVehicle.value.id) || []).length > 0
      )
        return;

      const { data, error, status } = await supabase
        .from('changelog_with_profile')
        .select(columns.join(','))
        .match(filters)
        .eq('vehicle_id', currentVehicle.value.id)
        .order('created_at', { ascending: false })
        .limit(100)
        .returns<Tables<'changelog_with_profile'>[]>();

      if (error && status !== 406) throw error;

      initRealtime();

      changelogCache.set(currentVehicle.value.id, data ?? []);
      changelog.value = data ?? [];
    } catch (error) {
      console.error(error);
    }
  };

  const initRealtime = () => {
    try {
      if (!currentVehicle.value || !currentVehicle.value.id) return;

      supabase
        .channel('Changelog')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'Changelog',
            filter: `vehicle_id=eq.${currentVehicle.value.id}`,
          },
          payload => {
            if (!currentVehicle.value || !currentVehicle.value.id) return;
            if (payload.errors) throw payload.errors;

            const prevEntries =
              changelogCache.get(currentVehicle.value.id) || [];

            // Get missing fields from profiles, since realtime does not work views
            const profile = profiles.value.find(
              ({ user_id }) => user_id === payload.new['createdby_id'],
            );

            const newEntryWithProfile: Tables<'changelog_with_profile'> = {
              ...(payload.new as Tables<'Changelog'>),
              createdby_name: profile?.name || null,
              createdby_profile_image_url: profile?.profile_image_url || null,
            };

            changelogCache.set(currentVehicle.value.id, [
              ...prevEntries,
              newEntryWithProfile,
            ]);
          },
        )
        .subscribe();
    } catch (error) {
      console.log(error);
    }
  };

  return { changelog, getChangelog };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChangelogStore, import.meta.hot));
}
