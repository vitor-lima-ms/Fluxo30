import MainLayoutTemplate from '@/shared/components/MainLayoutTemplate.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{ component: MainLayoutTemplate, path: '/' }],
});

export default router;
