import type { LoanStatus } from "./LoanStatus";

export interface LoanStatusHistory {
  IdLoanStatusHistory: number;
  IdLoan: number;
  IdLoanStatus: number;
  observation: string;
  createdAt: string;
  createdByUserName: string;
  loanStatus: LoanStatus;
}