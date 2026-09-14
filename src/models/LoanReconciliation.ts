export type LoanReconciliationStatus =
  | "IGUAL"
  | "DIFERENTE"
  | "NO_EN_ARCHIVO"
  | "NO_EN_SIGHA";

export interface LoanReconciliationItem {
  status: LoanReconciliationStatus;
  fileDocumentNumber: string | null;
  fileFullName: string | null;
  fileAmount: number | null;
  IdLoan: number | null;
  isLoan: boolean | null;
  sighaDocumentNumber: string | null;
  sighaFullName: string | null;
  conceptName: string | null;
  lastDiscountDate: string | null;
  sighaAmount: number | null;
  difference: number | null;
}

export interface LoanReconciliationGroup {
  conceptName: string;
  total: number;
  equals: number;
  different: number;
  notInFile: number;
  notInSigha: number;
  items: LoanReconciliationItem[];
}

export interface LoanReconciliationResult {
  total: number;
  equals: number;
  different: number;
  notInFile: number;
  notInSigha: number;
  groups: LoanReconciliationGroup[];
}