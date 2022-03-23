/** BASE_URL转换成系统标志 */
const SystemKey = import.meta.env.VITE_BASE_URL.toUpperCase().replaceAll('/', '').replaceAll('-', '_');

/** sessionStorage */
const KEY_TOKEN = 'AHF_' + SystemKey + '_TOKEN';
const KEY_DEVICE = 'AHF_' + SystemKey + '_DEVICE';
const KEY_SIDEBAR = 'AHF_' + SystemKey + '_SIDEBAR';

/** token */
export const Token = {
  get() {
    return sessionStorage.getItem(KEY_TOKEN);
  },
  set(token: string) {
    sessionStorage.setItem(KEY_TOKEN, token);
  },
  clear() {
    sessionStorage.removeItem(KEY_TOKEN);
  },
};

/** 设备ID */
export const Device = {
  get() {
    return sessionStorage.getItem(KEY_DEVICE);
  },
  set(deviceId: string) {
    sessionStorage.setItem(KEY_DEVICE, deviceId);
  },
  clear() {
    sessionStorage.removeItem(KEY_DEVICE);
  },
};

/** 侧边栏状态 */
export const SidebarStatus = {
  get() {
    const k = sessionStorage.getItem(KEY_SIDEBAR);
    return k ? !!+k : true;
  },
  set(flag: boolean) {
    sessionStorage.setItem(KEY_SIDEBAR, flag + '');
  },
  clear() {
    sessionStorage.removeItem(KEY_SIDEBAR);
  },
};
