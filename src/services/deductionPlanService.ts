import type { DeductionPlan } from "../models/DeductionPlan";
import type { ApiResponse } from "../models/ApiResponse";
import { loansApiClient } from "./apiClient";

export const deductionPlanService = {
    
  async getAll(): Promise<ApiResponse<DeductionPlan[]>> {
    const response = await loansApiClient.get<ApiResponse<DeductionPlan[]>>("/loans/deduction-plan/");
    return response.data;
  },
};