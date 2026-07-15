import { loansApiClient } from "./apiClient";
import type { ApiResponse } from "../models/ApiResponse";
import type { Bank, BankCreate, BankUpdate, } from "../models/Bank";
import type { PaginatedResult, PaginationQuery } from "../components/common/Pagination";

export const bankService = {

  async getAll(query: PaginationQuery): Promise<ApiResponse<PaginatedResult<Bank>>> {
    const response = await loansApiClient.get<ApiResponse<PaginatedResult<Bank>>>("/loans/bank/", { params: { page: query.page, pageSize: query.pageSize, search: query.search || undefined, },});
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<Bank>> {
    const response = await loansApiClient.get<ApiResponse<Bank>>(`/loans/bank/${id}`);
    return response.data;
  },

  async create(data: BankCreate): Promise<ApiResponse<Bank>> {
    const response = await loansApiClient.post<ApiResponse<Bank>>("/loans/bank/", data);
    return response.data;
  },

  async update(id: number, data: BankUpdate): Promise<ApiResponse<Bank>> {
    const response = await loansApiClient.put<ApiResponse<Bank>>(`/loans/bank/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<Record<string, never>>> {
    const response = await loansApiClient.delete<ApiResponse<Record<string, never>>>(`/loans/bank/${id}`);
    return response.data;
  },
};