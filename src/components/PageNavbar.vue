<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();

const navbarRoutes = computed(() => {
  const routes = router.getRoutes();

  return routes.filter(({ meta }) => meta.showInNavbar);
});
</script>

<template>
  <div class="bg-base-300 w-full shadow">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img class="h-8" src="/favicon.ico" alt="Your Company" />
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <RouterLink
                v-for="route in navbarRoutes"
                :key="route.name"
                :to="route.path"
                class="btn btn-sm capitalize"
                :class="{
                  'btn-ghost btn-neutral':
                    router.currentRoute.value.name !== route.name,
                }"
                activeClass="btn-primary"
              >
                {{ route.name }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
