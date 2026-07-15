import type { PaginatedResult } from "../components/common/Pagination";
import type { LoanLog, LoanLogQuery } from "../models/LoanLog";
import type { ApiResponse } from "../models/ApiResponse";
import { loansApiClient } from "./apiClient";

export const loanLogService = {
  async getAll(query: LoanLogQuery): Promise<ApiResponse<PaginatedResult<LoanLog>>> {
    const response = await loansApiClient.get<ApiResponse<PaginatedResult<LoanLog>>>("/loans/loan-log/",
      {
        params: {
          page: query.page,
          pageSize: query.pageSize,
          employeeDocumentNumber: query.employeeDocumentNumber || undefined,
          actionDateFrom: query.actionDateFrom || undefined,
          actionDateTo: query.actionDateTo || undefined,
        },
      }
    );
    return response.data;
  },
};