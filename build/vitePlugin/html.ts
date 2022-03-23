import type { Plugin } from 'vite';

export function configHtmlPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'plugin-html-env',
    transformIndexHtml(html: string) {
      return html.replace(/<%=\s+(\w+)\s+%>/g, (_match, key) => {
        return `${env[key]}`;
      });
    },
  };
}
