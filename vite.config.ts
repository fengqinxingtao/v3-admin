import type { Plugin } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isBuild = command == 'build';
  const vitePlugins: Plugin[] = [
    {
      name: 'plugin-html-env',
      transformIndexHtml(html: string) {
        return html.replace(/<%=\s+(\w+)\s+%>/g, (_match, key) => {
          return `${env[key]}`;
        });
      },
    },
    // have to
    vue(),
  ];

  // @vitejs/plugin-legacy
  if (Boolean(env.VITE_LEGACY) && isBuild) {
    vitePlugins.push(
      legacy({
        targets: ['ie >= 10'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }),
    );
  }

  return {
    base: env.VITE_PUBLIC_PATH,
    server: {
      // host: true,
      port: Number(env.VITE_PROXY_PORT) || 3000,
      proxy: {
        '^/authentication': {
          target: env.VITE_PROXY_AUTH_URL,
          changeOrigin: true,
          logLevel: env.VITE_PROXY_LOG_LEVEL,
        },
        ['^' + env.VITE_BASE_URL]: {
          target: env.VITE_PROXY_URL,
          changeOrigin: true,
          logLevel: env.VITE_PROXY_LOG_LEVEL,
        },
        // '^/resources': process.env.VITE_PROXY_URL,
      },
    },
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: pathResolve('src') + '/',
        },
      ],
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${pathResolve(
              'src/design/color.less',
            )}";@import (reference) "${pathResolve('src/design/var.less')}";`,
            'primary-color': '#1890ff',
            'link-color': '#1890ff',
            'success-color': '#52c41a',
            'warning-color': '#faad14',
            'error-color': '#f5222d',
            'heading-color': 'rgba(0, 0, 0, 0.85)',
            'text-color': 'rgba(0, 0, 0, 0.65)',
            'text-color-secondary': 'rgba(0, 0, 0, 0.45)',
            'disabled-color': 'rgba(0, 0, 0, 0.25)',
            'border-radius-base': '4px',
            'border-color-base': '#d9d9d9',
            'box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)',
          },
          javascriptEnabled: true,
        },
      },
    },
    plugins: vitePlugins,
    build: {
      target: 'es2015',
      minify: 'terser',
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: Boolean(env.VITE_DROP_CONSOLE),
        },
      },
      // Turning off brotliSize display can slightly reduce packaging time
      brotliSize: false,
      chunkSizeWarningLimit: 2000,
    },
  };
});
