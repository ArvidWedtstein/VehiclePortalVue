<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router';
import { computed, ref } from 'vue';
import { useSessionStore } from '@/stores/general/userSession';
import { storeToRefs } from 'pinia';
import LoginModal from '../auth/LoginModal.vue';
import MenuItem from '../general/menu/MenuItem.vue';
import AvatarImage from '../general/utils/AvatarImage.vue';
import DropdownMenu from '../general/menu/DropdownMenu.vue';

const router = useRouter();

const loginModalRef = ref<InstanceType<typeof LoginModal>>();

const sessionStore = useSessionStore();

const { profile } = storeToRefs(sessionStore);

const navbarRoutes = computed(() => {
  const routes = router.getRoutes();

  return routes.filter(({ meta }) => meta.showInNavbar);
});
</script>

<template>
  <LoginModal ref="loginModalRef" />

  <div class="navbar fixed top-0 bg-base-300 z-[100]">
    <div class="navbar-start">
      <div class="inline-flex items-center text-xl space-x-0 gap-1">
        Vehicle
        <div class="badge badge-warning badge-outline">Hub</div>
      </div>
    </div>

    <div class="navbar-center hidden md:flex">
      <ul class="menu menu-horizontal px-1 gap-2">
        <li v-for="route in navbarRoutes" :key="route.name">
          <RouterLink
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
        </li>
      </ul>
    </div>
    <div class="navbar-end">
      <label class="swap swap-rotate mr-2">
        <input type="checkbox" class="theme-controller" value="light" />

        <svg
          class="swap-off h-6 w-6 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
          />
        </svg>

        <svg
          class="swap-on h-6 w-6 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
          />
        </svg>
      </label>

      <DropdownMenu
        alignMenu="end"
        menuSize="sm"
        btnClass="btn btn-ghost btn-circle"
      >
        <template #default>
          <AvatarImage
            tabindex="0"
            role="button"
            :src="profile?.profile_image_url"
            alt="My Profile Image"
            :fallbackSrc="`https://ui-avatars.com/api/?name=${profile?.name || 'Unknown User'}`"
            size="sm"
          />
        </template>

        <template #items>
          <template v-if="profile?.id">
            <MenuItem
              v-if="profile?.id"
              :to="{ name: 'profile', params: { id: profile.id } }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="size-4 fill-current"
              >
                <path
                  d="M302.584 306.83L257.453 397.094L240 336L272 288H176L208 336L190.547 397.094L145.416 306.83C62.818 321.33 0 393.248 0 480C0 497.672 14.326 512 32 512H416C433.674 512 448 497.672 448 480C448 393.248 385.182 321.33 302.584 306.83ZM48.992 464C54.424 420.43 81.787 383.182 120.66 364.65L170.334 464H48.992ZM277.666 464L327.34 364.65C366.213 383.182 393.576 420.43 399.008 464H277.666ZM224 256C294.693 256 352 198.691 352 128C352 57.307 294.693 0 224 0S96 57.307 96 128C96 198.691 153.307 256 224 256ZM224 48C268.111 48 304 83.887 304 128C304 172.111 268.111 208 224 208S144 172.111 144 128C144 83.887 179.889 48 224 48Z"
                />
              </svg>
              Profile
            </MenuItem>
            <MenuItem @click="sessionStore.logout">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                class="size-4 fill-current"
              >
                <path
                  d="M80 96A48 48 0 1 0 80 0a48 48 0 1 0 0 96zM64 128c-35.3 0-64 28.7-64 64L0 320c0 17.7 14.3 32 32 32c9.8 0 18.5-4.4 24.4-11.2L80.4 485.3c2.9 17.4 19.4 29.2 36.8 26.3s29.2-19.4 26.3-36.8L123.1 352l15.7 0 30 134.9c3.8 17.3 20.9 28.1 38.2 24.3s28.1-20.9 24.3-38.2l-57.3-258 116.3 53.8c.5 .3 1.1 .5 1.6 .7c8.6 3.6 18 3.1 25.9-.7c3.4-1.6 6.6-3.9 9.3-6.7c3.1-3.2 5.5-7 7.1-11.4c.1-.3 .2-.7 .3-1l2.5-7.5c5.7-17.1 18.3-30.9 34.7-38.2l8-3.5c1-.4 1.9-.8 2.9-1.2l-16.9 63.5c-5.6 21.1-.1 43.6 14.7 59.7l70.7 77.1 22 88.1c4.3 17.1 21.7 27.6 38.8 23.3s27.6-21.7 23.3-38.8l-23-92.1c-1.9-7.8-5.8-14.9-11.2-20.8l-49.5-54 19.3-65.5 9.6 23c4.4 10.6 12.5 19.3 22.8 24.5l26.7 13.3c15.8 7.9 35 1.5 42.9-14.3s1.5-35-14.3-42.9L537 232.7l-15.3-36.8C504.5 154.8 464.3 128 419.7 128c-22.8 0-45.3 4.8-66.1 14l-8 3.5c-24.4 10.9-44.6 29-58.1 51.6L157.3 136.9C144.7 131 130.9 128 117 128l-53 0zM464 96a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM349.7 335.6l-25 62.4-59.4 59.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L372.3 441c4.6-4.6 8.2-10.1 10.6-16.1l14.5-36.2-40.7-44.4c-2.5-2.7-4.8-5.6-7-8.6z"
                />
              </svg>
              Logout
            </MenuItem>
          </template>

          <MenuItem v-else @click="loginModalRef?.open()">Login</MenuItem>
        </template>
      </DropdownMenu>
    </div>
  </div>
</template>
