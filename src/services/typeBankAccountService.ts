import { loansApiClient } from "./apiClient";
import type { ApiResponse } from "../models/ApiResponse";
import type { PaginatedResult, PaginationQuery } from "../components/common/Pagination";
import type { TypeBankAccount, TypeBankAccountCreate, TypeBankAccountUpdate, } from "../models/TypeBankAccount";

export const typeBankAccountService = {

  async getAll(query: PaginationQuery): Promise<ApiResponse<PaginatedResult<TypeBankAccount>>> {
    const response = await loansApiClient.get<ApiResponse<PaginatedResult<TypeBankAccount>>>("/loans/typeBankAccount/", { params: { page: query.page, pageSize: query.pageSize, search: query.search || undefined, },});
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<TypeBankAccount>> {
    const response = await loansApiClient.get<ApiResponse<TypeBankAccount>>(`/loans/typeBankAccount/${id}`);
    return response.data;
  },

  async create(data: TypeBankAccountCreate): Promise<ApiResponse<TypeBankAccount>> {
    const response = await loansApiClient.post<ApiResponse<TypeBankAccount>>("/loans/typeBankAccount/", data);
    return response.data;
  },

  async update(id: number, data: TypeBankAccountUpdate): Promise<ApiResponse<TypeBankAccount>> {
    const response = await loansApiClient.put<ApiResponse<TypeBankAccount>>(`/loans/typeBankAccount/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<Record<string, never>>> {
    const response = await loansApiClient.delete<ApiResponse<Record<string, never>>>(`/loans/typeBankAccount/${id}`);
    return response.data;
  },
};