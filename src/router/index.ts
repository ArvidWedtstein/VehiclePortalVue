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
      meta: {
        showInNavbar: true,
      },
    },
    {
      path: '/vehicles/:id',
      name: 'vehicle',
      component: async () => await import('../views/VehicleView.vue'),
      meta: {
        showInNavbar: false,
      },
    },
  ],
});

export default router;
