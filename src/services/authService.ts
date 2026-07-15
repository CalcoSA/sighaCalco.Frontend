import type { AuthResult, LoginRequest } from "../models/Auth.ts";
import type { ApiResponse } from "../models/ApiResponse.ts";
import { authApiClient } from "./apiClient";

export const authService = {

  async login(data: LoginRequest): Promise<ApiResponse<AuthResult>> {
    const response = await authApiClient.post<ApiResponse<AuthResult>>("/authentication/auth/login", data);
    return response.data;
  },

  async me(): Promise<ApiResponse<AuthResult>> {
    const response = await authApiClient.get<ApiResponse<AuthResult>>("/authentication/auth/me");
    return response.data;
  },

  async intranetAccess(userLogin: string, ts: string, sig: string): Promise<ApiResponse<AuthResult>> {
    const response = await authApiClient.get<ApiResponse<AuthResult>>("/authentication/auth/intranet-access", { params: { userLogin, ts, sig, }, });
    return response.data;
  },
};