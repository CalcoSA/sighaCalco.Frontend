import type { User, UserCreate, UserUpdate, WordpressUser, } from "../models/User";
import type { ApiResponse } from "../models/ApiResponse";
import { authApiClient } from "./apiClient";

export const userService = {

  async searchWordpressUsers(search: string): Promise<ApiResponse<WordpressUser[]>> {
    const response = await authApiClient.get<ApiResponse<WordpressUser[]>>("/authentication/user/wordpress-users", { params: { search }, });
    return response.data;
  },

  async getAll(): Promise<ApiResponse<User[]>> {
    const response = await authApiClient.get<ApiResponse<User[]>>("/authentication/user/");
    return response.data;
  },

  async create(data: UserCreate): Promise<ApiResponse<User>> {
    const response = await authApiClient.post<ApiResponse<User>>("/authentication/user/", data);
    return response.data;
  },

  async update(idUser: number, data: UserUpdate): Promise<ApiResponse<User>> {
    const response = await authApiClient.put<ApiResponse<User>>(`/authentication/user/${idUser}`, data);
    return response.data;
  },
};