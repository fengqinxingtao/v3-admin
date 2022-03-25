import type { AppRouteRecordRaw } from '@/types/vue-router';
import { LAYOUT } from '@/router/constant';

const dashboard: AppRouteRecordRaw = {
  path: '/stableManage',
  component: LAYOUT,
  children: [
    {
      path: '',
      name: 'StableManage',
      component: () => import('@/views/stableManage/index.vue'),
      meta: {
        affix: true,
        title: '圈舍管理',
      },
    },
  ],
};

export default dashboard;
