export type ResponseModalSeverity = "success" | "error" | "warning" | "info";

export type ModalMode = "create" | "update";

export interface ResponseModalProps {
  open: boolean;
  severity: ResponseModalSeverity;
  title: string;
  message: string;
  buttonText?: string;
  confirmButtonText?: string;
  onClose: () => void;
  onConfirm?: () => void;
}

export interface ResponseModalState {
  open: boolean;
  severity: ResponseModalSeverity;
  title: string;
  message: string;
}