import { SidebarStatus, ThemeMode } from '@/utils/storage';
import { AppDeviceEnum, ThemeModeEnum } from '@/enums/app';

interface AppState {
  themeMode?: ThemeModeEnum;
  sidebarCollapsed: boolean;
  device: AppDeviceEnum;
}

const state: AppState = {
  themeMode: undefined,
  sidebarCollapsed: true,
  // 设备：deskstop-桌面  mobile-手机
  device: AppDeviceEnum.DESKTOP,
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
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
