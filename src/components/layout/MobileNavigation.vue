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
  <div class="btm-nav flex md:hidden bg-base-300 z-10">
    <RouterLink
      v-for="route in navbarRoutes"
      :key="route.name"
      :to="route.path"
      class="capitalize"
      :class="{
        'text-base-content': router.currentRoute.value.name !== route.name,
      }"
      activeClass="text-primary active"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 fill-current"
        viewBox="0 0 512 512"
        v-if="route.meta.iconPath"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          :d="route.meta.iconPath.toString() || ''"
        />
      </svg>
      <span class="btm-nav-label">{{ route.name }}</span>
    </RouterLink>
  </div>
</template>
