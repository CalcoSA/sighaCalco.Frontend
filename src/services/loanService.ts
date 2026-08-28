import type { LoanQuery, Loan, LoanCreate, LoanUpdate, ServiceValueUpdate } from "../models/Loan";
import type { PaginatedResult } from "../components/common/Pagination";
import type { LoanScheduled } from "../models/LoanScheduled";
import type { ApiResponse } from "../models/ApiResponse";
import { loansApiClient } from "./apiClient";

export const loanService = {

  async getAll(query: LoanQuery): Promise<ApiResponse<PaginatedResult<Loan>>> {
    const response = await loansApiClient.get<ApiResponse<PaginatedResult<Loan>>>("/loans/loan/",
      {
        params: {
          page: query.page,
          pageSize: query.pageSize,
          employeeDocumentNumber: query.employeeDocumentNumber || undefined,
          IdLoanStatus: query.IdLoanStatus || undefined,
          requestDateFrom: query.requestDateFrom || undefined,
          requestDateTo: query.requestDateTo || undefined,
        },
      }
    );
    return response.data;
  },
    
  async create(data: LoanCreate): Promise<ApiResponse<Loan>> {
    const response = await loansApiClient.post<ApiResponse<Loan>>("/loans/loan/", data);
    return response.data;
  },

  async updateStatus(IdLoan: number, data: LoanUpdate): Promise<ApiResponse<Loan>> {
    const response = await loansApiClient.put<ApiResponse<Loan>>(`/loans/loan/${IdLoan}/status`, data);
    return response.data;
  },

  async updateServiceValue(IdLoan: number, data: ServiceValueUpdate): Promise<ApiResponse<Loan>> {
    const response = await loansApiClient.put<ApiResponse<Loan>>(`/loans/loan/${IdLoan}/service-value`, data);
    return response.data;
  },

  async processScheduled(): Promise<ApiResponse<LoanScheduled>> {
    const response = await loansApiClient.post<ApiResponse<LoanScheduled>>("/loans/loan/scheduled");
    return response.data;
  },
};