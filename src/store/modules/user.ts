import type { Menu, UserInfo } from '@/types/store';
import type { AppRouteRecordRaw } from '@/types/vue-router';
import type { RouteRecordName, RouteRecordRaw } from 'vue-router';

import path from 'path-browserify';
import Router, { resetRouter } from '@/router';
import { asyncRoutes, NotFoundRoute } from '@/router/routes';
import http from '@/utils/http';
import { Token } from '@/utils/storage';
import { listToTree } from '@/utils/tree';

import { message as Message } from 'ant-design-vue';

/**
 * 通过menu.url判断是否拥有菜单权限
 */
function findRouteMenu(menuList: Menu[], route: AppRouteRecordRaw, basePath: string): Menu | undefined {
  if (menuList == null || route == null) return;

  if (route.children && route.children.length) {
    // 父路由
    return menuList.find((o) => o.url && o.url.toLowerCase().startsWith(path.join(basePath, route.path).toLowerCase()));
  } else if (route.meta && route.meta.parentUrl) {
    // 叶子路由
    if (typeof route.meta.parentUrl === 'string') {
      const pStr: string = route.meta.parentUrl.toLowerCase();
      return menuList.find((o) => o.url && pStr === o.url.toLowerCase());
    } else if (Array.isArray(route.meta.parentUrl)) {
      const temp: string[] = route.meta.parentUrl.map((e) => e.toLowerCase());
      return menuList.find((o) => o.url && temp.indexOf(o.url.toLowerCase()) > -1);
    }
  } else {
    // 子页面路由
    return menuList.find((o) => o.url && path.join(basePath, route.path).toLowerCase() === o.url.toLowerCase());
  }
  return;
}

/**
 * 过滤路由
 */
function filterAsyncRoutes(asyncRoutes: AppRouteRecordRaw[], menuList: Menu[], basePath = '/'): AppRouteRecordRaw[] {
  return asyncRoutes.filter((route) => {
    let menu = findRouteMenu(menuList, route, basePath);
    if (menu) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRoutes(
          route.children,
          menuList,
          path.join(basePath, route.path),
        ) as RouteRecordRaw[];
        // 添加404
        route.children.push({
          ...NotFoundRoute,
          name: (NotFoundRoute.name?.toString() +
            '_' +
            (route.name || path.basename(route.path)).toString()) as RouteRecordName,
        } as RouteRecordRaw);
      } else {
        // 设置标题
        if (route.meta) route.meta.title = menu.menuName;
        // 设置图标 FIXME
        if (route.meta && route.meta.icon) {
          if (menu.parentId === 0) {
            menu.icon = route.meta.icon;
          } else {
            menu = menuList.find((o) => o.menuId === menu!.parentId);
            if (menu) menu.icon = route.meta.icon;
          }
        }
      }
      return true;
    }
    return false;
  });
}
interface UserState {
  user?: UserInfo;
  menuList: Menu[];
  permissionList: Menu[];
}

const state: UserState = {
  user: undefined,
  menuList: [], // 菜单列表
  permissionList: [], // 权限列表
};

const getters = {
  user: (state: UserState) => state.user,
  menuList: (state: UserState) => state.menuList,
  permissionList: (state: UserState) => state.menuList,
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setMenuList(state, list) {
    state.menuList = list;
  },
  setPermisstionList(state, list) {
    state.permissionList = list;
  },
};

const actions = {
  // remove token
  resetToken({ commit }) {
    commit('setUser', undefined);
    commit('setMenuList', []);
    commit('setPermisstionList', []);
    Token.clear();
  },
  // 退出登录
  async logout({ dispatch }) {
    return new Promise((resolve, reject) => {
      http
        .post('/authentication/logOut')
        .then(() => {
          dispatch('resetToken');
          resetRouter();

          resolve(null);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // 设置登录信息
  setLoginInfo({ commit, dispatch }, loginInfo: any) {
    if (loginInfo == null) return;
    // 保存登录菜单信息、权限信息
    if (loginInfo.resources && loginInfo.resources.length > 0) {
      // 提取权限。menuType=F
      commit(
        'setPermisstionList',
        loginInfo.resources.filter((o) => o.menuType === 'F' || o.menuFlag !== '0'),
      );
      // 提取菜单
      let menuList: Menu[] = loginInfo.resources.filter((o) => o.menuFlag === '0');
      // 过滤路由
      const accessRoutes = filterAsyncRoutes(asyncRoutes, menuList);
      accessRoutes.forEach((route) => {
        // 添加授权路由
        Router.addRoute(route as RouteRecordRaw);
      });

      // 转成树状结构
      menuList = listToTree(menuList, {
        id: 'menuId',
        pid: 'parentId',
      });
      // 没有url的菜单
      menuList.forEach((item) => {
        // 顶级菜单 - 添加默认图标
        if (item.parentId === 0 && !item.icon) {
          item.icon = 'el-icon-s-grid';
        }
      });
      commit('setMenuList', menuList);
      delete loginInfo.resources;
    } else {
      Message.error('您当前没有访问权限！');
      // 报错直接跳转登录
      dispatch('logout');
      return;
    }

    commit('setUser', loginInfo);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
