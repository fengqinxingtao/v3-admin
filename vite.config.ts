import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import { createVitePlugins } from './build/vitePlugin';
import { generateModifyVars } from './build/generate/generateModifyVars';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isBuild = command === 'build';

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
          modifyVars: generateModifyVars(),
          javascriptEnabled: true,
        },
      },
    },
    plugins: createVitePlugins(env, isBuild),
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
