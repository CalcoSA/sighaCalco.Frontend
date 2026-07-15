import { loansApiClient } from "./apiClient";
import type { ApiResponse } from "../models/ApiResponse";
import type { DescCen1, DescCen1Create, DescCen1Update, } from "../models/DescCen1";
import type { PaginatedResult, PaginationQuery } from "../components/common/Pagination";

export const descCen1Service = {

  async getAll(query: PaginationQuery): Promise<ApiResponse<PaginatedResult<DescCen1>>> {
    const response = await loansApiClient.get<ApiResponse<PaginatedResult<DescCen1>>>("/loans/descCen1/", { params: { page: query.page, pageSize: query.pageSize, search: query.search || undefined, },});
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<DescCen1>> {
    const response = await loansApiClient.get<ApiResponse<DescCen1>>(`/loans/descCen1/${id}`);
    return response.data;
  },

  async create(data: DescCen1Create): Promise<ApiResponse<DescCen1>> {
    const response = await loansApiClient.post<ApiResponse<DescCen1>>("/loans/descCen1/", data);
    return response.data;
  },

  async update(id: number, data: DescCen1Update): Promise<ApiResponse<DescCen1>> {
    const response = await loansApiClient.put<ApiResponse<DescCen1>>(`/loans/descCen1/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<Record<string, never>>> {
    const response = await loansApiClient.delete<ApiResponse<Record<string, never>>>(`/loans/descCen1/${id}`);
    return response.data;
  },
};