import { useSessionStore } from '@/stores/general/userSession';
import { storeToRefs } from 'pinia';
import type {
  NavigationGuardNext,
  RouteLocationNormalizedGeneric,
} from 'vue-router';

export const authGuard = async (
  to: RouteLocationNormalizedGeneric,
  from: RouteLocationNormalizedGeneric,
  next: NavigationGuardNext,
): Promise<void> => {
  const sessionStore = useSessionStore();
  const { isAuthenticated } = storeToRefs(sessionStore);
  const { saveRedirectRoute } = sessionStore;

  if (!to.meta?.requireAuth || isAuthenticated.value) {
    return next();
  } else {
    saveRedirectRoute(to);
    return next({ name: 'signIn' });
  }
};
