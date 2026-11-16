import DesignSystemPage from '@/pages/DesignSystemPage.vue';
import MainLayoutTemplate from '@/shared/components/MainLayoutTemplate.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      children: [{ component: DesignSystemPage, path: '' }],
      component: MainLayoutTemplate,
      path: '/',
    },
  ],
});

export default router;
