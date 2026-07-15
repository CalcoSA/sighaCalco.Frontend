import type { PaginationQuery } from "../components/common/Pagination";

export interface LoanLogQuery extends PaginationQuery {
  employeeDocumentNumber?: string;
  actionDateFrom?: string;
  actionDateTo?: string;
}

export interface LoanLog {
  IdLoanLog: number;
  actionType: string;
  IdLoan: number | null;
  IdLoanInstallment: number | null;
  installmentNumber: number | null;
  employeeDocumentNumber: string | null;
  conceptName: string | null;
  loanStatusName: string | null;
  installmentStatusName: string | null;
  observation: string | null;
  actorUserName: string | null;
  actionDate: string;
}