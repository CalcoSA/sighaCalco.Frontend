import { loansApiClient } from "./apiClient";
import type { ApiResponse } from "../models/ApiResponse";
import type { DescCen2, DescCen2Create, DescCen2Update, } from "../models/DescCen2";
import type { PaginatedResult, PaginationQuery } from "../components/common/Pagination";

export const descCen2Service = {

  async getAll(query: PaginationQuery): Promise<ApiResponse<PaginatedResult<DescCen2>>> {
    const response = await loansApiClient.get<ApiResponse<PaginatedResult<DescCen2>>>("/loans/descCen2/", { params: { page: query.page, pageSize: query.pageSize, search: query.search || undefined, },});
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<DescCen2>> {
    const response = await loansApiClient.get<ApiResponse<DescCen2>>(`/loans/descCen2/${id}`);
    return response.data;
  },

  async create(data: DescCen2Create): Promise<ApiResponse<DescCen2>> {
    const response = await loansApiClient.post<ApiResponse<DescCen2>>("/loans/descCen2/", data);
    return response.data;
  },

  async update(id: number, data: DescCen2Update): Promise<ApiResponse<DescCen2>> {
    const response = await loansApiClient.put<ApiResponse<DescCen2>>(`/loans/descCen2/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<Record<string, never>>> {
    const response = await loansApiClient.delete<ApiResponse<Record<string, never>>>(`/loans/descCen2/${id}`);
    return response.data;
  },
};