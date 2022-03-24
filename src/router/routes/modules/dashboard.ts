import type { AppRouteRecordRaw } from '@/types/vue-router';
import { LAYOUT } from '@/router/constant';

const dashboard: AppRouteRecordRaw = {
  path: '/dashboard',
  component: LAYOUT,
  children: [
    {
      path: '',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: {
        affix: true,
        title: '首页',
      },
    },
  ],
};

export default dashboard;
