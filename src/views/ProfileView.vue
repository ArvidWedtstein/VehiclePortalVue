<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient';
import { useSessionStore } from '@/stores/userSession';
import { toRefs } from 'vue';

const sessionStore = useSessionStore();

const { profile } = toRefs(sessionStore);

const handleUserTermination = () => {
  if (!profile.value) return;
  console.log('User termination');
  // TODO: Implement user termination
  // Add a confirmation dialog
  supabase.rpc('terminate_user', { profile_user_id: profile.value.user_id });
};
</script>

<template>
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
        type="button"
        class="btn btn-sm ms-auto float-end btn-error"
        @click="handleUserTermination"
      >
        Delete all my data
      </button>
    </div>
  </div>
</template>
