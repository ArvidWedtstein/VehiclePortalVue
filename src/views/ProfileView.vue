<script setup lang="ts">
import { useSessionStore } from '@/stores/userSession';
import { toRefs } from 'vue';

const sessionStore = useSessionStore();

const { profile } = toRefs(sessionStore);
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
    </div>
  </div>
</template>
