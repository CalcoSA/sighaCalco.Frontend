import type { Role, RoleCreate, RoleUpdate } from "../models/Role";
import type { ApiResponse } from "../models/ApiResponse";
import type { MenuOption } from "../models/MenuOption";
import { authApiClient } from "./apiClient";

export const roleService = {
  
  async getAll(): Promise<ApiResponse<Role[]>> {
    const response = await authApiClient.get<ApiResponse<Role[]>>("/authentication/role/");
    return response.data;
  },

  async getActive(): Promise<ApiResponse<Role[]>> {
    const response = await authApiClient.get<ApiResponse<Role[]>>("/authentication/role/active");
    return response.data;
  },

  async getMenuOptions(): Promise<ApiResponse<MenuOption[]>> {
    const response = await authApiClient.get<ApiResponse<MenuOption[]>>("/authentication/menu-option/");
    return response.data;
  },

  async getMenuOptionsByRole(roleId: number): Promise<ApiResponse<MenuOption[]>> {
    const response = await authApiClient.get<ApiResponse<MenuOption[]>>(`/authentication/role/${roleId}/menu-options`);
    return response.data;
  },

  async create(data: RoleCreate): Promise<ApiResponse<Role>> {
    const response = await authApiClient.post<ApiResponse<Role>>("/authentication/role/", data);
    return response.data;
  },

  async update(roleId: number, data: RoleUpdate): Promise<ApiResponse<Role>> {
    const response = await authApiClient.put<ApiResponse<Role>>(`/authentication/role/${roleId}`, data);
    return response.data;
  },
};