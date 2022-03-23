import { SidebarStatus, ThemeMode } from '@/utils/storage';
import { AppDeviceEnum, ThemeModeEnum } from '@/enums/app';

interface AppState {
  themeMode?: ThemeModeEnum;
  pageLoading: boolean;
  sidebarCollapsed: boolean;
  device: AppDeviceEnum;
}

const state: AppState = {
  themeMode: undefined,
  pageLoading: false,
  sidebarCollapsed: true,
  device: AppDeviceEnum.DESKTOP,
};

const getters = {
  themeMode(state: AppState): ThemeModeEnum {
    return state.themeMode || ThemeMode.get() || ThemeModeEnum.LIGHT;
  },
  pageLoading(state: AppState): boolean {
    return state.pageLoading;
  },
  sidebarCollapsed(state: AppState): boolean {
    return state.sidebarCollapsed;
  },
  isMobile(state: AppState): boolean {
    return state.device == AppDeviceEnum.MODILE;
  },
};

const mutations = {
  setThemeMode: (state: AppState, mode: ThemeModeEnum) => {
    state.themeMode = mode;
    ThemeMode.set(mode);
  },
  toggleSidebar: (state: AppState) => {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    if (state.sidebarCollapsed) {
      SidebarStatus.set(1);
    } else {
      SidebarStatus.set(0);
    }
  },
  toggleDevice: (state, device: AppDeviceEnum) => {
    state.device = device;
  },
  setPageLoading: (state, loading: boolean) => {
    state.pageLoading = loading;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
