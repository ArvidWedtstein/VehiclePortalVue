import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        iconPath: `M576 247.992C576 241.19 573.123 234.435 567.529 229.679L303.531 5.672C299.047 1.891 293.523 0 288 0S276.953 1.891 272.469 5.672L8.471 229.679C2.877 234.435 0 241.19 0 247.992C0 264.08 13.826 271.992 24.02 271.992C29.499 271.992 35.009 270.125 39.533 266.305L64.002 245.541V471.999C64.002 494.062 81.939 512 104.001 512H200.001C222.063 512 240 494.062 240 471.999V351.995H336V471.999C336 494.062 353.937 512 375.999 512H471.999C494.061 512 511.998 494.062 511.998 471.999V245.541L536.467 266.305C540.983 270.118 546.498 271.993 551.983 271.993C562.143 271.993 576 263.963 576 247.992ZM463.999 463.999H383.999V343.995C383.999 321.932 366.062 303.994 344 303.994H232C209.938 303.994 192.001 321.932 192.001 343.995V463.999H112.001V207.991C112.001 207.028 111.564 206.207 111.452 205.274L288 55.455L463.999 204.809V463.999Z`,
        showInNavbar: true,
      },
    },
    {
      path: '/profile/:id',
      name: 'profile',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: async () => await import('../views/ProfileView.vue'),
      meta: {
        showInNavbar: false,
      },
      props: true,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: async () => await import('../views/AboutView.vue'),
      meta: {
        showInNavbar: true,
      },
    },
    {
      path: '/vehicles',
      name: 'vehicles',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: async () => await import('../views/VehiclesView.vue'),
      children: [
        {
          path: ':vehicle_id(\\d+)',
          name: 'vehicle',
          component: async () => await import('../views/VehicleView.vue'),
          children: [
            {
              name: 'expenses',
              path: 'expenses',
              component: async () =>
                await import('../views/vehicle/ExpensesView.vue'),
              children: [
                {
                  name: 'expense',
                  path: ':id(\\d+)',
                  component: async () =>
                    await import('../views/vehicle/ExpenseView.vue'),
                },
              ],
            },
            {
              name: 'services',
              path: 'services',
              component: async () =>
                await import('../views/vehicle/ServicesView.vue'),
              children: [
                {
                  name: 'service',
                  path: ':id(\\d+)',
                  component: async () =>
                    await import('../views/vehicle/ServiceView.vue'),
                },
              ],
            },

            {
              name: 'files',
              path: 'files',
              component: async () =>
                await import('../views/vehicle/FilesView.vue'),
            },
            {
              name: 'changelog',
              path: 'changelog',
              component: async () =>
                await import('../views/vehicle/ChangelogView.vue'),
            },
          ],
        },
      ],
      meta: {
        iconPath: `M112 256C94.328 256 80 270.326 80 288C80 305.672 94.328 320 112 320S144 305.672 144 288C144 270.326 129.672 256 112 256ZM400 256C382.328 256 368 270.326 368 288C368 305.672 382.328 320 400 320S432 305.672 432 288C432 270.326 417.672 256 400 256ZM462.939 188.74L422.375 87.328C408.938 53.719 376.859 32 340.672 32H171.328C135.141 32 103.062 53.719 89.625 87.328L49.061 188.74C19.91 205.219 0 236.125 0 272V448C0 465.672 14.326 480 32 480S64 465.672 64 448V400H448V448C448 465.672 462.326 480 480 480S512 465.672 512 448V272C512 236.125 492.09 205.219 462.939 188.74ZM134.188 105.141C140.297 89.875 154.875 80 171.328 80H340.672C357.125 80 371.703 89.875 377.812 105.141L406.156 176H105.844L134.188 105.141ZM464 352H48V272C48 245.533 69.533 224 96 224H416C442.467 224 464 245.533 464 272V352Z`,
        showInNavbar: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404 - Page not found',
      component: async () => await import('../views/404View.vue'),
      meta: {
        showInNavbar: false,
      },
    },
  ],
});

export default router;
