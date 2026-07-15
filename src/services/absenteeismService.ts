import { loansApiClient } from "./apiClient";
import type { ApiResponse } from "../models/ApiResponse";
import type { PaginatedResult, PaginationQuery } from "../components/common/Pagination";
import type { Absenteeism, AbsenteeismCreate, AbsenteeismUpdate, } from "../models/Absenteeism";

export const absenteeismService = {

  async getAll(query: PaginationQuery): Promise<ApiResponse<PaginatedResult<Absenteeism>>> {
    const response = await loansApiClient.get<ApiResponse<PaginatedResult<Absenteeism>>>("/loans/absenteeism/", { params: { page: query.page, pageSize: query.pageSize, search: query.search || undefined, },});
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<Absenteeism>> {
    const response = await loansApiClient.get<ApiResponse<Absenteeism>>(`/loans/absenteeism/${id}`);
    return response.data;
  },

  async create(data: AbsenteeismCreate): Promise<ApiResponse<Absenteeism>> {
    const response = await loansApiClient.post<ApiResponse<Absenteeism>>("/loans/absenteeism/", data);
    return response.data;
  },

  async update(id: number, data: AbsenteeismUpdate): Promise<ApiResponse<Absenteeism>> {
    const response = await loansApiClient.put<ApiResponse<Absenteeism>>(`/loans/absenteeism/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<Record<string, never>>> {
    const response = await loansApiClient.delete<ApiResponse<Record<string, never>>>(`/loans/absenteeism/${id}`);
    return response.data;
  },
};