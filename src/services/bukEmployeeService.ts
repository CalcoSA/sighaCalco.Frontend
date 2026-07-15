import type { ApiResponse } from "../models/ApiResponse";
import type { BukEmployee } from "../models/BukEmployee";
import { loansApiClient } from "./apiClient";

export const bukEmployeeService = {
  async getByDocument(documentNumber: string): Promise<ApiResponse<BukEmployee>> {
    const response = await loansApiClient.get<ApiResponse<BukEmployee>>("/loans/buk/employee-by-document", { params: { document_number: documentNumber, },});
    return response.data;
  },
};