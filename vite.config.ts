import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const plugins = [
    // 替换index.html中的env
    {
      name: 'plugin-html-env',
      transformIndexHtml(html: string) {
        return html.replace(/<%=\s+(\w+)\s+%>/g, (_match, key) => {
          return `${env[key]}`;
        });
      },
    },
    vue(),
  ];
  // IE浏览器支持
  if (Boolean(env.VITE_LEGACY)) {
    plugins.push(
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
          charset: false,
          additionalData: '@import "./src/design/variable.less";@import "./src/design/mixins.less";',
        },
      },
    },
    plugins: plugins,
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
