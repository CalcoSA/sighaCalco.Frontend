import { loansApiClient } from "./apiClient";
import type { ApiResponse } from "../models/ApiResponse";
import type { PaginatedResult, PaginationQuery } from "../components/common/Pagination";
import type { Diagnosis, DiagnosisCreate, DiagnosisUpdate, } from "../models/Diagnosis";

export const diagnosisService = {

  async getAll(query: PaginationQuery): Promise<ApiResponse<PaginatedResult<Diagnosis>>> {
    const response = await loansApiClient.get<ApiResponse<PaginatedResult<Diagnosis>>>("/loans/diagnosis/", { params: { page: query.page, pageSize: query.pageSize, search: query.search || undefined, },});
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<Diagnosis>> {
    const response = await loansApiClient.get<ApiResponse<Diagnosis>>(`/loans/diagnosis/${id}`);
    return response.data;
  },

  async create(data: DiagnosisCreate): Promise<ApiResponse<Diagnosis>> {
    const response = await loansApiClient.post<ApiResponse<Diagnosis>>("/loans/diagnosis/", data);
    return response.data;
  },

  async update(id: number, data: DiagnosisUpdate): Promise<ApiResponse<Diagnosis>> {
    const response = await loansApiClient.put<ApiResponse<Diagnosis>>(`/loans/diagnosis/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<Record<string, never>>> {
    const response = await loansApiClient.delete<ApiResponse<Record<string, never>>>(`/loans/diagnosis/${id}`);
    return response.data;
  },
};