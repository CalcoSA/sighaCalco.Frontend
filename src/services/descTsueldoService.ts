import { loansApiClient } from "./apiClient";
import type { ApiResponse } from "../models/ApiResponse";
import type { PaginatedResult, PaginationQuery } from "../components/common/Pagination";
import type { DescTsueldo, DescTsueldoCreate, DescTsueldoUpdate, } from "../models/DescTsueldo";

export const descTsueldoService = {

  async getAll(query: PaginationQuery): Promise<ApiResponse<PaginatedResult<DescTsueldo>>> {
    const response = await loansApiClient.get<ApiResponse<PaginatedResult<DescTsueldo>>>("/loans/descTsueldo/", { params: { page: query.page, pageSize: query.pageSize, search: query.search || undefined, },});
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<DescTsueldo>> {
    const response = await loansApiClient.get<ApiResponse<DescTsueldo>>(`/loans/descTsueldo/${id}`);
    return response.data;
  },

  async create(data: DescTsueldoCreate): Promise<ApiResponse<DescTsueldo>> {
    const response = await loansApiClient.post<ApiResponse<DescTsueldo>>("/loans/descTsueldo/", data);
    return response.data;
  },

  async update(id: number, data: DescTsueldoUpdate): Promise<ApiResponse<DescTsueldo>> {
    const response = await loansApiClient.put<ApiResponse<DescTsueldo>>(`/loans/descTsueldo/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<Record<string, never>>> {
    const response = await loansApiClient.delete<ApiResponse<Record<string, never>>>(`/loans/descTsueldo/${id}`);
    return response.data;
  },
};