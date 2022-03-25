<template>
  <div class="header-box">
    <nav>
      <div class="nav-list">
        <template v-for="(item, index) in navList">
          <div style="margin-right: 8px">
            <Dropdown trigger="hover">
              <span @click.prevent :class="`${item.children?.length ? 'hasListLabel' : 'listLabel'}`">
                <span v-if="index" style="margin-right: 4px">/</span>
                {{ item.menuName }}
                <DownOutlined v-if="item.children?.length" />
              </span>
              <template #overlay>
                <Menu v-if="item.children?.length">
                  <MenuItem :key="item2.menuId" v-for="item2 in item.children">
                    <RouterLink :to="item2.url">{{ item2.menuName }}</RouterLink>
                  </MenuItem>
                </Menu>
              </template>
            </Dropdown>
          </div>
        </template>
      </div>
      <div class="user-box">
        <Dropdown trigger="hover">
          <span @click.prevent :class="`'hasListLabel`">
            <span>{{ user.name }}</span
            ><DownOutlined />
          </span>
          <template #overlay>
            <Menu>
              <MenuItem>
                <div @click="handleLogOut">退出登录</div>
              </MenuItem>
              <MenuItem>
                <div>修改密码</div>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </div>
    </nav>
  </div>
</template>
<script lang="ts">
import type { Menu as MenuType } from '@/types/store';
import { findNode } from '@/utils/tree';
import { DownOutlined } from '@ant-design/icons-vue';
import { Dropdown, Menu, MenuItem } from 'ant-design-vue';
import { defineComponent } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'LayoutHeader',
  components: { Dropdown, Menu, MenuItem, DownOutlined, RouterLink },
  setup() {
    const store = useStore();
    const menuList = store.getters['user/menuList'];
    const user = store.getters['user/user'];
    const route = useRoute();
    const path = '/enterprise/lender/list' || route.path;
    const navList: Array<MenuType> = [];
    const node = findNode(menuList, (node) => node.url === path, {
      id: 'menuId',
      pid: 'parentId',
    });
    navList.unshift(node);
    const getNavList = (_node) => {
      if (_node.parentId) {
        const curNode = findNode(menuList, (node) => node.menuId === _node.parentId, {
          id: 'menuId',
          pid: 'parentId',
        });
        navList.unshift(curNode);
        getNavList(curNode);
      }
    };
    getNavList(node);

    function handleLogOut() {
      store.dispatch('user/logout');
    }
    return {
      navList,
      user,
      handleLogOut
    };
  },
});
</script>
<style lang="less">
.header-box {
  color: #333;
  padding-left: 100px;
  background: white;
  > nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    .nav-list {
      display: flex;
      .hasListLabel {
        cursor: pointer;
      }
    }
    .user-box{
      margin-right: 40px;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
</style>
