import { loansApiClient } from "./apiClient";
import type { ApiResponse } from "../models/ApiResponse";
import type { DescCen3, DescCen3Create, DescCen3Update, } from "../models/DescCen3";
import type { PaginatedResult, PaginationQuery } from "../components/common/Pagination";

export const descCen3Service = {

  async getAll(query: PaginationQuery): Promise<ApiResponse<PaginatedResult<DescCen3>>> {
    const response = await loansApiClient.get<ApiResponse<PaginatedResult<DescCen3>>>("/loans/descCen3/", { params: { page: query.page, pageSize: query.pageSize, search: query.search || undefined, },});
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<DescCen3>> {
    const response = await loansApiClient.get<ApiResponse<DescCen3>>(`/loans/descCen3/${id}`);
    return response.data;
  },

  async create(data: DescCen3Create): Promise<ApiResponse<DescCen3>> {
    const response = await loansApiClient.post<ApiResponse<DescCen3>>("/loans/descCen3/", data);
    return response.data;
  },

  async update(id: number, data: DescCen3Update): Promise<ApiResponse<DescCen3>> {
    const response = await loansApiClient.put<ApiResponse<DescCen3>>(`/loans/descCen3/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<Record<string, never>>> {
    const response = await loansApiClient.delete<ApiResponse<Record<string, never>>>(`/loans/descCen3/${id}`);
    return response.data;
  },
};