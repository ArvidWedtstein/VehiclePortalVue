import { computed, reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';
import type { Tables } from '@/database.types';

export const useProfilesStore = defineStore('profiles', () => {
  const profilesCache = reactive(
    new Map<Tables<'Profiles'>['id'], Tables<'Profiles'>>(),
  );

  const loading = ref(false);

  const profiles = computed(() => {
    if (profilesCache.size < 2 && !loading.value) {
      getProfiles();

      return [];
    }

    return Array.from(profilesCache.values());
  });

  const getProfiles = async (profile_id?: Tables<'Profiles'>['id']) => {
    try {
      if (profilesCache.size > 0 && !profile_id) {
        return Array.from(profilesCache.values());
      }

      loading.value = true;

      const { data, error, status } = await supabase
        .from('Profiles')
        .select(
          `id, 
          user_id, 
          name, 
          profile_image_url
        `,
        )
        .match(profile_id ? { id: profile_id } : {})
        .returns<Tables<'Profiles'>[]>();

      if (error && status !== 406) throw error;

      data?.forEach(profile => {
        profilesCache.set(profile.id, profile);
      });

      return data || [];
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }

      return [];
    } finally {
      loading.value = false;
    }
  };

  return { profiles, getProfiles };
});
