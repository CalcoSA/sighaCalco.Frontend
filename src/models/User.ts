import type { Role } from "./Role";

export interface WordpressUser {
  wordpressUserId: number;
  wordpressUserLogin: string;
  wordpressUserName: string;
  wordpressUserEmail: string;
}

export interface User {
  IdUser: number;
  wordpressUserId: number;
  userLogin: string;
  userName : string;
  statusUser: boolean;
  roles: Role[];
}

export interface UserCreate {
  wordpressUserId: number;
  userLogin: string;
  userName: string;
  statusUser: boolean;
  roleIds: number[];
}

export interface UserUpdate {
  statusUser: boolean;
  roleIds: number[];
}