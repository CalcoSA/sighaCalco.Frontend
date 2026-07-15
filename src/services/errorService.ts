import type { ApiValidation } from "../models/ApiValidation";
import axios from "axios";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data?.Message) {
      return data.Message;
    }

    if (data?.message) {
      return data.message;
    }

    if (data?.result?.detail) {
      return data.result.detail;
    }

    if (data?.detail) {
      if (typeof data.detail === "string") {
        return data.detail;
      }

      if (Array.isArray(data.detail)) {
        return data.detail
          .map((item: ApiValidation) => {
            return item.msg || item.message || JSON.stringify(item);
          })
          .join(", ");
      }
    }

    return "Ocurrió un error al procesar la solicitud.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado.";
}