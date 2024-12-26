import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';
import { type Session } from '@supabase/supabase-js';
import type { Tables } from '@/database.types';
import type { RouteLocationNormalizedGeneric } from 'vue-router';
import router from '@/router';

export const useSessionStore = defineStore('session', () => {
  const session = ref<Session | null>(null);
  const profile = ref<Tables<'Profiles'> | null>(null);

  const isAuthenticated = computed(() => {
    return !!session.value;
  });

  const getProfile = async () => {
    try {
      if (!session.value?.user.id) return;

      const { data, error, status } = await supabase
        .from('Profiles')
        .select(
          `
          id, 
          user_id, 
          name, 
          profile_image_url, 
          role_id, 
          Roles (
            name
          )
        `,
        )
        .eq('user_id', session.value?.user.id)
        .returns<Tables<'Profiles'>>()
        .single();

      if (error && status !== 406) throw error;

      profile.value = data;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const googleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/callback`,
        },
      });

      if (error) throw error;

      return data;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const login = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
      });

      if (error) throw error;

      alert('Check your email for the login link!');

      return data;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      session.value = null;
      profile.value = null;

      if (error) throw error;
    } catch (error) {
      alert(error);
    }
  };

  const setSession = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      alert(error);
      return;
    }

    session.value = data.session;
  };

  const initialize = async () => {
    supabase.auth.onAuthStateChange(async (event, _session) => {
      if (session.value?.refresh_token !== _session?.refresh_token) {
        console.info('Auth State Changed', event);
      }
      session.value = _session;

      if (!profile.value) {
        getProfile();
      }

      if (event === 'SIGNED_IN') {
        const route = loadRedirectRoute();

        if (!route) return;

        router.replace(route);
      }
    });

    await setSession();

    await getProfile();
  };

  const saveRedirectRoute = (
    route: Partial<RouteLocationNormalizedGeneric>,
  ) => {
    const { name, params, query, hash } = route;

    localStorage.setItem(
      'redirectRoute',
      JSON.stringify({
        name,
        params,
        query,
        hash,
      }),
    );
  };

  const loadRedirectRoute = () => {
    const route = JSON.parse(
      localStorage.getItem('redirectRoute') || 'null',
    ) as Partial<RouteLocationNormalizedGeneric> | null;

    localStorage.removeItem('redirectRoute');

    return route;
  };

  return {
    session,
    profile,
    isAuthenticated,
    initialize,
    logout,
    login,
    googleLogin,
    saveRedirectRoute,
    loadRedirectRoute,
  };
});
