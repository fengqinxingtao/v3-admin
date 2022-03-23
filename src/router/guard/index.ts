import type { Router, RouteLocationNormalized } from 'vue-router';
import store from '@/store';
import { Token } from '@/utils/storage';
import createPermissionGuard from './permissionGuard';

export function setupRouterGuard(router: Router) {
  createPageGuard(router);
  createPageLoadingGuard(router);
  createScrollGuard(router);
  createPermissionGuard(router);
}

/** 加载过的页面处理得更快  */
function createPageGuard(router: Router) {
  const loadedPageMap = new Map<string, boolean>();

  router.beforeEach(async (to) => {
    if (to.meta.title) {
      document.title = import.meta.env.VITE_APP_NAME + ' - ' + to.meta.title;
    }
    to.meta.loaded = !!loadedPageMap.get(to.path);

    return true;
  });

  router.afterEach((to) => {
    loadedPageMap.set(to.path, true);
  });
}

// Used to handle page loading status
function createPageLoadingGuard(router: Router) {
  router.beforeEach((to) => {
    if (!Token.get()) {
      return true;
    }
    if (to.meta.loaded) {
      return true;
    }

    store.commit('app/setPageLoading', true);
    return true;
  });
  router.afterEach(() => {
    if (store.getters['app/pageLoading']) {
      // TODO Looking for a better way
      // The timer simulates the loading time to prevent flashing too fast,
      setTimeout(() => {
        store.commit('app/setPageLoading', false);
      }, 220);
    }
    return true;
  });
}

// 页面切换后，滚动置顶
function createScrollGuard(router: Router) {
  const isHash = (href: string) => {
    return /^#/.test(href);
  };

  const body = document.body;

  router.afterEach(async (to) => {
    // scroll top
    isHash((to as RouteLocationNormalized & { href: string })?.href) && body.scrollTo(0, 0);
    return true;
  });
}
