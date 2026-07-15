import type { ApiResponse } from "../models/ApiResponse";
import type { LoanStatus } from "../models/LoanStatus";
import { loansApiClient } from "./apiClient";

export const loanStatusService = {

  async getAll(): Promise<ApiResponse<LoanStatus[]>> {
    const response = await loansApiClient.get<ApiResponse<LoanStatus[]>>("/loans/status-loan/");
    return response.data;
  },
};