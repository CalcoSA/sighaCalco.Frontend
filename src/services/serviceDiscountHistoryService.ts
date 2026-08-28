import type { ServiceDiscountHistory } from "../models/ServiceDiscountHistory";
import type { PaginatedResult } from "../components/common/Pagination";
import type { ApiResponse } from "../models/ApiResponse";
import { loansApiClient } from "./apiClient";

export const serviceDiscountHistoryService = {

  async getByLoanId(IdLoan: number, page: number, pageSize: number): Promise<ApiResponse<PaginatedResult<ServiceDiscountHistory>>> {
    const response = await loansApiClient.get<ApiResponse<PaginatedResult<ServiceDiscountHistory>>>(`/loans/service-discount-history/loan/${IdLoan}`, { params: { page, pageSize },});
    return response.data;
  },
};