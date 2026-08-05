import type { LoanStatusHistory } from "../models/LoanStatusHistory";
import type { ApiResponse } from "../models/ApiResponse";
import { loansApiClient } from "./apiClient";

export const loanStatusHistoryService = {

  async getById(IdLoanStatusHistory: number): Promise<ApiResponse<LoanStatusHistory>> {
    const response = await loansApiClient.get<ApiResponse<LoanStatusHistory>>(`/loans/loan-status-history/${IdLoanStatusHistory}`);
    return response.data;
  },

  async getByLoanId(IdLoan: number): Promise<ApiResponse<LoanStatusHistory[]>> {
    const response = await loansApiClient.get<ApiResponse<LoanStatusHistory[]>>(`/loans/loan-status-history/loan/${IdLoan}`);
    return response.data;
  },
};