import { ref } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';
import type { Tables } from '@/database.types';

export const useProfilesStore = defineStore('profiles', () => {
  const profilesCache = ref<Tables<'Profiles'>[]>([]);

  const getProfiles = async () => {
    try {
      if (profilesCache.value.length > 0) {
        return profilesCache.value;
      }

      const { data, error, status } = await supabase
        .from('Profiles')
        .select(
          `id, 
          user_id, 
          name, 
          profile_image_url
        `,
        )
        .returns<Tables<'Profiles'>[]>();

      if (error && status !== 406) throw error;

      profilesCache.value = data || [];

      return data || [];
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }

      return [];
    }
  };

  return { getProfiles };
});
