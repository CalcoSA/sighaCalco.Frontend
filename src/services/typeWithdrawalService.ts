import { loansApiClient } from "./apiClient";
import type { ApiResponse } from "../models/ApiResponse";
import type { PaginatedResult, PaginationQuery } from "../components/common/Pagination";
import type { TypeWithdrawal, TypeWithdrawalCreate, TypeWithdrawalUpdate, } from "../models/TypeWithdrawal";

export const typeWithdrawalService = {

  async getAll(query: PaginationQuery): Promise<ApiResponse<PaginatedResult<TypeWithdrawal>>> {
    const response = await loansApiClient.get<ApiResponse<PaginatedResult<TypeWithdrawal>>>("/loans/typeWithdrawal/", { params: { page: query.page, pageSize: query.pageSize, search: query.search || undefined, },});
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<TypeWithdrawal>> {
    const response = await loansApiClient.get<ApiResponse<TypeWithdrawal>>(`/loans/typeWithdrawal/${id}`);
    return response.data;
  },

  async create(data: TypeWithdrawalCreate): Promise<ApiResponse<TypeWithdrawal>> {
    const response = await loansApiClient.post<ApiResponse<TypeWithdrawal>>("/loans/typeWithdrawal/", data);
    return response.data;
  },

  async update(id: number, data: TypeWithdrawalUpdate): Promise<ApiResponse<TypeWithdrawal>> {
    const response = await loansApiClient.put<ApiResponse<TypeWithdrawal>>(`/loans/typeWithdrawal/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<Record<string, never>>> {
    const response = await loansApiClient.delete<ApiResponse<Record<string, never>>>(`/loans/typeWithdrawal/${id}`);
    return response.data;
  },
};