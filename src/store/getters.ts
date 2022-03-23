import { AppDeviceEnum } from '@/enums/app';

export default {
  /** app module */
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  isMobile: (state) => state.app.device === AppDeviceEnum.MODILE,
  /** user module */
  // user: (state) => state.user.user,
  // menuList: (state) => state.user.menuList,
  // permissionList: (state) => state.user.permissionList,
};
