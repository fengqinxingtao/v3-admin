import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  { path: '/dashboard', component: () => import('@/views/Dashboard.vue') },
  { path: '/login', component: () => import('@/views/Login.vue') },
  { path: '/:pathMatch(.*)*', component: () => import('@/views/404.vue') },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
