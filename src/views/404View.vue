<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div
    class="hero min-h-screen rounded-lg overflow-hidden"
    style="
      background-image: url(https://images.unsplash.com/photo-1531850959096-cfbb6f26c5a8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D);
    "
  >
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content text-neutral-content text-center">
      <div class="max-w-md">
        <span class="text-2xl font-semibold text-primary">404</span>
        <h1 class="mb-5 text-5xl font-bold">Page not found</h1>
        <p class="mb-5">The page you are looking for doesn't exist.</p>
        <RouterLink to="/" class="btn btn-link btn-primary btn-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="w-3 fill-current"
          >
            <path
              d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"
            />
          </svg>
          Back to home
        </RouterLink>
      </div>
    </div>
  </div>
</template>
