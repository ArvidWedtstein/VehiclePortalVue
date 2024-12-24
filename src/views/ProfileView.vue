<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient';
import { useProfilesStore } from '@/stores/profiles';
import { useSessionStore } from '@/stores/general/userSession';
import { computed, onBeforeMount, toRefs } from 'vue';
import { useRouter } from 'vue-router';

const sessionStore = useSessionStore();
const profilesStore = useProfilesStore();

const { profile: myProfile } = toRefs(sessionStore);
const { profiles } = toRefs(profilesStore);

const router = useRouter();

const profileId = computed(() => {
  return Array.isArray(router.currentRoute.value.params.id)
    ? parseInt(router.currentRoute.value.params.id[0])
    : parseInt(router.currentRoute.value.params.id);
});

const profile = computed(() => {
  return profiles.value.filter(({ id }) => id === profileId.value)[0];
});

const handleUserTermination = () => {
  if (!profile.value) return;
  console.log('User termination');
  // TODO: Implement user termination
  // Add a confirmation dialog

  confirm('Are you sure you want to delete all your data?');
  supabase.rpc('terminate_user', { profile_user_id: profile.value.user_id });
};

onBeforeMount(async () => {
  const res = await profilesStore.getProfiles(profileId.value);

  if (!res.length) {
    router.push({ name: '404 - Page not found' });
  }
});
</script>

<template>
  <button type="button" @click="router.back()" class="flex gap-2 mb-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      class="w-3 fill-current"
    >
      <path
        d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"
      />
    </svg>
    Back
  </button>

  <div class="hero bg-base-200">
    <div class="hero-content flex-col lg:flex-row">
      <img
        v-if="profile?.profile_image_url"
        :src="profile?.profile_image_url"
        class="max-w-sm rounded-lg shadow-2xl"
      />
      <div>
        <h1 class="text-5xl font-bold">{{ profile?.name }}</h1>
        <!-- <p class="py-6">Your role: {{ profile?.role_id }}</p> -->
      </div>
      <button
        v-if="myProfile?.id === profile?.id"
        type="button"
        class="btn btn-sm ms-auto float-end btn-error"
        @click="handleUserTermination"
      >
        Delete all my data
      </button>
    </div>
  </div>
</template>
