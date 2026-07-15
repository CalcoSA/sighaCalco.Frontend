import { loansApiClient } from "./apiClient";
import type { ApiResponse } from "../models/ApiResponse";
import type { DescCen4, DescCen4Create, DescCen4Update, } from "../models/DescCen4";
import type { PaginatedResult, PaginationQuery } from "../components/common/Pagination";

export const descCen4Service = {

  async getAll(query: PaginationQuery): Promise<ApiResponse<PaginatedResult<DescCen4>>> {
    const response = await loansApiClient.get<ApiResponse<PaginatedResult<DescCen4>>>("/loans/descCen4/", { params: { page: query.page, pageSize: query.pageSize, search: query.search || undefined, },});
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<DescCen4>> {
    const response = await loansApiClient.get<ApiResponse<DescCen4>>(`/loans/descCen4/${id}`);
    return response.data;
  },

  async create(data: DescCen4Create): Promise<ApiResponse<DescCen4>> {
    const response = await loansApiClient.post<ApiResponse<DescCen4>>("/loans/descCen4/", data);
    return response.data;
  },

  async update(id: number, data: DescCen4Update): Promise<ApiResponse<DescCen4>> {
    const response = await loansApiClient.put<ApiResponse<DescCen4>>(`/loans/descCen4/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<Record<string, never>>> {
    const response = await loansApiClient.delete<ApiResponse<Record<string, never>>>(`/loans/descCen4/${id}`);
    return response.data;
  },
};