import { PAGE_NOT_FOUND_NAME, REDIRECT_NAME, LAYOUT } from '@/router/constant';
import { PageEnum } from '@/enums/app';
import type { AppRouteRecordRaw } from '@/types/vue-router';

const modules = import.meta.globEager('./modules/**/*.ts');

const routeModuleList: AppRouteRecordRaw[] = [];

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/Login.vue'),
  meta: {
    title: '登录',
  },
};

// 404 on a page
export const NotFoundRoute: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: PAGE_NOT_FOUND_NAME,
  component: () => import('@/views/404.vue'),
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
    hideMenu: true,
  },
};

export const RedirectRoute: AppRouteRecordRaw = {
  path: '/redirect',
  component: LAYOUT,
  name: 'RedirectTo',
  meta: {
    title: REDIRECT_NAME,
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: REDIRECT_NAME,
      component: () => import('/@/views/Redirect.vue'),
      meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true,
      },
    },
  ],
};

// Basic routing without permission
export const basicRoutes = [LoginRoute, RootRoute, RedirectRoute, NotFoundRoute];

export const asyncRoutes = [NotFoundRoute, ...routeModuleList];
