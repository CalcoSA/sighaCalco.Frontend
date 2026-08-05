import type { LoanInstallment, LoanInstallmentCreate } from "./LoanInstallment";
import type { PaginationQuery } from "../components/common/Pagination";

export interface LoanQuery extends PaginationQuery {
  employeeDocumentNumber?: string;
  IdLoanStatus?: number;
  requestDateFrom?: string;
  requestDateTo?: string;
}

export interface Loan {
  IdLoan: number;
  employeeDocumentNumber: string;
  employeeFullName: string;
  employeeRoleName: string | null;
  employeeCostCenterName: string | null;
  crossDocument: string | null;
  IdConcept: number;
  conceptName: string;
  IdDeductionPlan: number;
  deductionPlanName: string;
  IdLoanStatus: number;
  loanStatusName: string;
  loanAmount: number;
  numberInstallments: number;
  paidInstallments: number;
  remainingAmount: number;
  requestDate: string;
  startDiscountDate: string;
  endDiscountDate: string | null;
  observation: string | null;
  createdByUserName: string;
  updatedByUserName: string | null;
  createdAt: string;
  updatedAt: string | null;
  loanInstallments: LoanInstallment[];
}

export interface LoanCreate {
  employeeDocumentNumber: string;
  employeeFullName: string;
  employeeRoleName: string | null;
  employeeCostCenterName: string | null;
  IdConcept: number;
  conceptName: string;
  IdDeductionPlan: number;
  deductionPlanName: string;
  IdLoanStatus: number;
  loanStatusName: string;
  loanAmount: number;
  numberInstallments: number;
  requestDate: string;
  startDiscountDate: string;
  endDiscountDate: string | null;
  crossDocument: string | null;
  observation: string | null;
  createdByUserName: string;
  loanInstallments: LoanInstallmentCreate[];
}

export interface LoanUpdate {
  IdLoanStatus: number;
  observation: string;
  updatedByUserName: string;
}