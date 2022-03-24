import type { Router } from 'vue-router';
import { NotFoundRoute } from '@/router/routes';
import { Token } from '@/utils/storage';
import { PageEnum } from '@/enums/app';
import store from '@/store';
import http from '@/utils/http';

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const whitePathList: string[] = [LOGIN_PATH];

export default function createPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // 白名单处理
    if (whitePathList.includes(to.path)) {
      next();
      return;
    }

    // token does not exist
    if (!Token.get()) {
      // redirect login page
      const redirectData: { path: string; replace: boolean; query?: Record<string, string> } = {
        path: LOGIN_PATH,
        replace: true,
      };
      if (to.path) {
        redirectData.query = {
          ...to.query,
          redirect: to.path,
        };
      }
      next(redirectData);
      return;
    }
    if (store.getters['user/user'] == null) {
      try {
        // 刷新用户信息
        const res = await http.get('/authentication/resource');
        store.dispatch('user/setLoginInfo', res.data);
        // 动态路由加载的HOCK处理
        next({ path: to.path, replace: true });
      } catch (err) {
        console.error(err);
        // 报错直接退出登录
        store.dispatch('user/resetToken');
        next(`/login?redirect=${to.path}`);
      }
      return;
    }

    if (!store.getters['dict/inited']) {
      try {
        await store.dispatch('dict/getDictData');
      } catch (err) {
        console.error(err);
      }
    }

    // Jump to the 404 page after processing the login
    if (from.path === LOGIN_PATH && to.name === NotFoundRoute.name) {
      next(PageEnum.BASE_HOME);
      return;
    }

    next();
  });
}
