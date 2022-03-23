/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_CODE: string;
  readonly VITE_DEVICE_TYPE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
