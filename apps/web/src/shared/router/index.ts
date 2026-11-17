import AuthLayoutTemplate from '@/shared/components/templates/AuthLayoutTemplate.vue';
import DesignSystemPage from '@/pages/DesignSystemPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import MainLayoutTemplate from '@/shared/components/templates/MainLayoutTemplate.vue';
import { useSessionStore } from '@/shared/stores/sessionStore.ts';
import { createRouter, createWebHistory } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean;
    requiresAuth?: boolean;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      children: [{ component: LoginPage, path: '' }],
      component: AuthLayoutTemplate,
      meta: { public: true },
      path: '/login',
    },
    {
      children: [{ component: DesignSystemPage, path: '' }],
      component: MainLayoutTemplate,
      meta: { requiresAuth: true },
      path: '/',
    },
  ],
});

router.beforeEach(async (to) => {
  const sessionStore = useSessionStore();

  if (!sessionStore.sessionResolved) {
    try {
      await sessionStore.fetchCurrentUser();
    } catch {
      // Erro já passou pelo ErrorHandler; segue como visitante.
    }
  }

  const isPublic = to.matched.some((record) => record.meta.public === true);
  const requiresAuth = to.matched.some(
    (record) => record.meta.requiresAuth === true,
  );

  if (requiresAuth && !sessionStore.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }

  if (isPublic && sessionStore.isAuthenticated) {
    return { path: '/' };
  }

  return true;
});

export default router;
