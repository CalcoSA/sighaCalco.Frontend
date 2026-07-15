export interface FileRequest {
  file: File;
  dateFrom: string;
  dateTo: string;
}

export interface OnlyOfficeGenerateResult {
  documentServerUrl: string;
  config: Record<string, any>;
}