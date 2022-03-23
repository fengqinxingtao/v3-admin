import type { Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import { configHtmlPlugin } from './html';
import { configThemePlugin } from './theme';

export function createVitePlugins(viteEnv: Record<string, string>, isBuild: boolean) {
  const { VITE_LEGACY } = viteEnv;

  const vitePlugins: (Plugin | Plugin[])[] = [
    configHtmlPlugin(viteEnv),
    // have to
    vue(),
  ];

  // @vitejs/plugin-legacy
  Boolean(VITE_LEGACY) &&
    isBuild &&
    vitePlugins.push(
      legacy({
        targets: ['ie >= 10'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }),
    );

  //vite-plugin-theme
  vitePlugins.push(configThemePlugin(isBuild));

  return vitePlugins;
}
