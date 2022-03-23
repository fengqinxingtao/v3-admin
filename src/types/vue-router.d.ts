import type { RouteRecordRaw, RouteMeta } from 'vue-router';

import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    // 标题
    title: string;
    // 是否忽略权限验证
    ignoreAuth?: boolean;
    // 是否缓存
    keepAlive?: boolean;
    // 图标
    icon?: string;
    // 叶子页面，需指定父级路由地址
    parentUrl?: string | string[];
  }
}

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  meta?: RouteMeta;
}
