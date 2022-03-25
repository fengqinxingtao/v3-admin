export const REDIRECT_NAME = 'Redirect';

export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

export const PARENT_LAYOUT_NAME = 'ParentLayout';

export const PAGE_STABLE_MANAGE = 'stableManage'

/**
 * @description: default layout
 */
export const LAYOUT = () => import('@/layout/index.vue');

/**
 * @description: parent-layout
 */
export const getParentLayout = (_name?: string) => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: PARENT_LAYOUT_NAME,
      });
    });
};
