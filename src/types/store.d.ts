export interface UserInfo {
  userId: string | number;

  name: string;

  realName: string;

  avatar: string;

  desc?: string;

  homePath?: string;
}

export interface Menu {
  parentId: number;

  menuId: number;

  menuName: string;

  url: string;

  perms: string;

  menuFlag: string;

  menuType: string;

  icon?: string;

  children?: Menu[];
}
