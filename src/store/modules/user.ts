import type { Menu, UserInfo } from '@/types/store';

import { resetRouter } from '@/router';
import http from '@/utils/http';
import { Token } from '@/utils/storage';
import { listToTree } from '@/utils/tree';

import { message as Message } from 'ant-design-vue';

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
  setLoginInfo({ commit, dispatch }, loginInfo) {
    if (loginInfo == null) return;

    // 保存登录菜单信息、权限信息
    if (loginInfo.resources && loginInfo.resources.length > 0) {
      // 提取权限。menuType=F
      commit(
        'setPermisstionList',
        loginInfo.resources.filter((o) => o.menuType === 'F' || o.menuFlag !== '0'),
      );
      // 提取菜单
      let menuList = loginInfo.resources.filter((o) => o.menuFlag === '0');
      // 过滤路由
      // const accessRoutes = filterAsyncRoutes(asyncRoutes, menuList);
      // accessRoutes.forEach((route) => {
      //   // 添加授权路由
      //   Router.addRoute(route);
      // });

      // 转成树状结构
      menuList = listToTree(menuList, {
        id: 'menuId',
        pid: 'parentId',
      });
      // 没有url的菜单
      menuList.forEach((item) => {
        if (!item.url && item.children && item.children.length) {
          item.subUrl = item.children[0].url;
        }
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
  mutations,
  actions,
};
