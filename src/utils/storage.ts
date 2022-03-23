import { ThemeModeEnum } from '@/enums/app';

/** BASE_URL转换成系统标志 */
const SystemKey = import.meta.env.VITE_BASE_URL.toUpperCase().replaceAll('/', '').replaceAll('-', '_');

/** sessionStorage */
const KEY_TOKEN = 'AHF_' + SystemKey + '_TOKEN';
/** localStorage */
const KEY_DEVICE = 'AHF_' + SystemKey + '_DEVICE';
const KEY_SIDEBAR = 'AHF_' + SystemKey + '_SIDEBAR';
const KEY_THEME_MODE = 'AHF_' + SystemKey + '_THEME_MODE';

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
    return localStorage.getItem(KEY_DEVICE);
  },
  set(deviceId: string) {
    localStorage.setItem(KEY_DEVICE, deviceId);
  },
  clear() {
    localStorage.removeItem(KEY_DEVICE);
  },
};

/** 侧边栏状态 */
export const SidebarStatus = {
  get(): boolean {
    const k = localStorage.getItem(KEY_SIDEBAR);
    return k ? !!+k : true;
  },
  set(flag: number) {
    localStorage.setItem(KEY_SIDEBAR, flag + '');
  },
  clear() {
    localStorage.removeItem(KEY_SIDEBAR);
  },
};

/** 主题状态 */
export const ThemeMode = {
  get(): ThemeModeEnum | undefined {
    return localStorage.getItem(KEY_THEME_MODE) as ThemeModeEnum | undefined;
  },
  set(mode: ThemeModeEnum) {
    localStorage.setItem(KEY_THEME_MODE, mode);
  },
  clear() {
    localStorage.removeItem(KEY_THEME_MODE);
  },
};
