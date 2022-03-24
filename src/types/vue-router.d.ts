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
    // 固定在tab，不可关闭
    affix?: boolean;
    // 不在Tab中显示
    hideTab?: boolean;
    // 不在menu中显示
    hideMenu?: boolean;
    // 不在面包屑中显示
    hideBreadcrumb?: boolean;
    // 图标
    icon?: string;
    // 叶子页面，需指定父级路由地址
    parentUrl?: string | string[];
  }
}

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  meta?: RouteMeta;
}
