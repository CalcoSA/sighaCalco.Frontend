export interface LoginRequest {
  username: string;
  password: string;
}

export interface RoleAuth {
  IdRole: number;
  nameRole: string;
  statusRole: boolean;
}

export interface MenuOptionAuth {
  IdMenuOption: number;
  nameMenuOption: string;
  pathMenuOption: string | null;
  parentMenuOption: number | null;
  orderMenuOption: number;
  statusMenuOption: boolean;
}

export interface AuthUser {
  IdUser: number | null;
  wordpressUserId: number | null;
  userLogin: string;
  userEmail: string;
  userName: string;
  roles: RoleAuth[];
  menuOptions: MenuOptionAuth[];
}

export interface AuthResult {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
}