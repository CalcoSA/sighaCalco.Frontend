import { loansApiClient } from "./apiClient";
import type { ApiResponse } from "../models/ApiResponse";
import type { PaginatedResult, PaginationQuery } from "../components/common/Pagination";
import type { Incapacity, IncapacityCreate, IncapacityUpdate, } from "../models/Incapacity";

export const incapacityService = {

  async getAll(query: PaginationQuery): Promise<ApiResponse<PaginatedResult<Incapacity>>> {
    const response = await loansApiClient.get<ApiResponse<PaginatedResult<Incapacity>>>("/loans/incapacity/", { params: { page: query.page, pageSize: query.pageSize, search: query.search || undefined, },});
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<Incapacity>> {
    const response = await loansApiClient.get<ApiResponse<Incapacity>>(`/loans/incapacity/${id}`);
    return response.data;
  },

  async create(data: IncapacityCreate): Promise<ApiResponse<Incapacity>> {
    const response = await loansApiClient.post<ApiResponse<Incapacity>>("/loans/incapacity/", data);
    return response.data;
  },

  async update(id: number, data: IncapacityUpdate): Promise<ApiResponse<Incapacity>> {
    const response = await loansApiClient.put<ApiResponse<Incapacity>>(`/loans/incapacity/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<Record<string, never>>> {
    const response = await loansApiClient.delete<ApiResponse<Record<string, never>>>(`/loans/incapacity/${id}`);
    return response.data;
  },
};