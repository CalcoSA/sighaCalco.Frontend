import { loansApiClient } from "./apiClient";
import type { ApiResponse } from "../models/ApiResponse";
import type { PaginatedResult, PaginationQuery } from "../components/common/Pagination";
import type { PayrollSinergy, PayrollSinergyCreate, PayrollSinergyUpdate, } from "../models/PayrollSinergy";

export const payrollSinergyService = {

  async getAll(query: PaginationQuery): Promise<ApiResponse<PaginatedResult<PayrollSinergy>>> {
    const response = await loansApiClient.get<ApiResponse<PaginatedResult<PayrollSinergy>>>("/loans/payrollSinergy/", { params: { page: query.page, pageSize: query.pageSize, search: query.search || undefined, },});
    return response.data;
  },

  async getPayroll(search?: string): Promise<ApiResponse<PayrollSinergy[]>> {
    const response = await loansApiClient.get<ApiResponse<PayrollSinergy[]>>("/loans/payrollSinergy/payroll", { params: { search: search?.trim() || undefined, },});
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<PayrollSinergy>> {
    const response = await loansApiClient.get<ApiResponse<PayrollSinergy>>(`/loans/payrollSinergy/${id}`);
    return response.data;
  },

  async create(data: PayrollSinergyCreate): Promise<ApiResponse<PayrollSinergy>> {
    const response = await loansApiClient.post<ApiResponse<PayrollSinergy>>("/loans/payrollSinergy/", data);
    return response.data;
  },

  async update(id: number, data: PayrollSinergyUpdate): Promise<ApiResponse<PayrollSinergy>> {
    const response = await loansApiClient.put<ApiResponse<PayrollSinergy>>(`/loans/payrollSinergy/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<Record<string, never>>> {
    const response = await loansApiClient.delete<ApiResponse<Record<string, never>>>(`/loans/payrollSinergy/${id}`);
    return response.data;
  },
};