import type { FileRequest, OnlyOfficeGenerateResult } from "../models/File";
import type { ApiResponse } from "../models/ApiResponse";
import { integrationApiClient } from "./apiClient";

export const fileService = {
  
  async generate(data: FileRequest): Promise<ApiResponse<OnlyOfficeGenerateResult>> {
    const formData = new FormData();

    formData.append("file", data.file);
    formData.append("dateFrom", data.dateFrom);
    formData.append("dateTo", data.dateTo);

    const response = await integrationApiClient.post<ApiResponse<OnlyOfficeGenerateResult>>("/integration/sinergy/generate", formData);
    return response.data;
  },
};