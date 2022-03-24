<template>
  <div class="layout-sider-dom" :style="getDomStyle"></div>
  <div
    v-click-outside="handleClickOutside"
    :class="[
      'layout-sider',
      themeMode,
      {
        open: openMenu,
        mini: siderCollapsed,
      },
    ]"
    :style="getWrapStyle"
    v-bind="getMenuEvents"
  >
    <div class="app-logo" :class="themeMode" @click="goHome">
      <img src="@/assets/logo.png" />
    </div>

    <Scrollbar class="sider-scrollbar">
      <div style="height: 800px; wdith: 100px; backgroud: red;"></div>
    </Scrollbar>

    <SiderTrigger class="sider-trigger" />
  </div>
</template>

<script lang="ts">
import type { Menu } from '@/types/store';
import { computed, CSSProperties, defineComponent, ref, unref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import clickOutside from '@/directives/clickOutside';
import { PageEnum, SIDE_BAR_MINI_WIDTH, SIDE_BAR_SHOW_TIT_MINI_WIDTH, MENU_WIDTH } from '@/enums/app';
import Scrollbar from '@/components/Scrollbar';
import SiderTrigger from './trigger.vue';

export default defineComponent({
  name: 'LayoutSider',
  directives: { clickOutside },
  components: {
    SiderTrigger, Scrollbar
  },
  setup() {
    const openMenu = ref(false);
    const childrenMenus = ref<Menu[]>([]);

    const store = useStore();
    const themeMode = computed(() => store.getters['app/themeMode']);
    const siderCollapsed = computed(() => store.getters['app/siderCollapsed']);
    const mixSideFixed = computed(() => store.getters['app/mixSideFixed']);
    const getIsFixed = computed(() => {
      const isFixed: boolean = unref(mixSideFixed) && unref(unref(childrenMenus).length > 0);
      if (isFixed) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        openMenu.value = true;
      }
      return isFixed;
    });
    const getMixSideWidth = computed(() => {
      return unref(siderCollapsed) ? SIDE_BAR_MINI_WIDTH : SIDE_BAR_SHOW_TIT_MINI_WIDTH;
    });
    const getDomStyle = computed((): CSSProperties => {
      let fixedWidth = 0;
      if (unref(getIsFixed)) {
        fixedWidth = unref(siderCollapsed) && !unref(mixSideFixed) ? SIDE_BAR_SHOW_TIT_MINI_WIDTH : MENU_WIDTH;
      }
      const width = `${unref(getMixSideWidth) + fixedWidth}px`;
      return getWrapCommonStyle(width);
    });
    const getWrapStyle = computed((): CSSProperties => {
      const width = `${unref(getMixSideWidth)}px`;
      return getWrapCommonStyle(width);
    });
    const getMenuEvents = computed(() => {
      return !unref(mixSideFixed)
        ? {
            onMouseleave: () => {
              setActive(true);
              closeMenu();
            },
          }
        : {};
    });

    function getWrapCommonStyle(width: string): CSSProperties {
      return {
        width,
        maxWidth: width,
        minWidth: width,
        flex: `0 0 ${width}`,
      };
    }

    function handleClickOutside() {
      setActive(true);
      closeMenu();
    }

    async function setActive(_setChildren = false) {
      // const path = currentRoute.value?.path;
      // if (!path) return;
      // activePath.value = await getCurrentParentPath(path);
      // // hanldeModuleClick(parentPath);
      // if (unref(getIsMixSidebar)) {
      //   const activeMenu = unref(menuModules).find((item) => item.path === unref(activePath));
      //   const p = activeMenu?.path;
      //   if (p) {
      //     const children = await getChildrenMenus(p);
      //     if (setChildren) {
      //       childrenMenus.value = children;
      //       if (unref(getMixSideFixed)) {
      //         openMenu.value = children.length > 0;
      //       }
      //     }
      //     if (children.length === 0) {
      //       childrenMenus.value = [];
      //     }
      //   }
      // }
    }

    function closeMenu() {
      // if (!unref(getIsFixed)) {
      //   openMenu.value = false;
      // }
    }

    const router = useRouter();
    function goHome() {
      router.push(PageEnum.BASE_HOME);
    }

    return {
      openMenu,
      themeMode,
      siderCollapsed,
      getMenuEvents,
      getDomStyle,
      getWrapStyle,
      handleClickOutside,
      goHome,
    };
  },
});
</script>

<style scoped lang="less">
.layout-sider {
  position: fixed;
  top: 0;
  left: 0;
  z-index: @layout-mix-sider-fixed-z-index;
  height: 100%;
  overflow: hidden;
  background-color: @sider-dark-bg-color;
  transition: all 0.2s ease 0s;
  width: 80px;
}
.app-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: @header-height;
  padding-left: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  img {
    width: @logo-width;
    height: @logo-width;
  }
}

.sider-scrollbar {
  width: 100%;
  height: calc(100% - @header-height - 38px);
  .scrollbar__wrap {
    margin-bottom: 18px !important;
    overflow-x: hidden;
  }

  .scrollbar__view {
    box-sizing: border-box;
  }
}

.sider-trigger {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  text-align: center;
  cursor: pointer;
  background-color: @trigger-dark-bg-color;
  height: 36px;
  line-height: 36px;
}
</style>
