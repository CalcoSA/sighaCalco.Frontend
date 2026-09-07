import type { LoanInstallment, LoanInstallmentCreate, LoanInstallmentUpdate } from "./LoanInstallment";
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
  isLoan: boolean;
  crossDocument: string | null;
  IdConcept: number;
  conceptName: string;
  IdDeductionPlan: number;
  deductionPlanName: string;
  IdLoanStatus: number;
  loanStatusName: string;
  loanAmount: number | null;
  serviceValue: number | null;
  numberInstallments: number | null;
  paidInstallments: number | null;
  remainingAmount: number | null;
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
  isLoan: boolean;
  IdConcept: number;
  conceptName: string;
  IdDeductionPlan: number;
  deductionPlanName: string;
  IdLoanStatus: number;
  loanStatusName: string;
  loanAmount: number | null;
  serviceValue: number | null;
  numberInstallments: number | null;
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

export interface ServiceValueUpdate {
  serviceValue: number;
  updatedByUserName: string;
}

export interface LoanReportQuery {
  dateFrom: string;
  dateTo: string;
}

export interface LoanReport {
  employeeDocumentNumber: string;
  employeeFullName: string;
  action: string;
  isLoan: boolean;
  IdConcept: number;
  conceptName: string;
  startDiscountDate: string;
  endDiscountDate: string | null;
  loanAmount: number | null;
  serviceValue: number | null;
  installmentValue: number | null;
  numberInstallments: number | null;
  IdDeductionPlan: number;
  deductionPlanName: string;
}

export interface LoanEdit {
  loanAmount: number;
  numberInstallments: number;
  endDiscountDate: string | null;
  updatedByUserName: string;
  loanInstallments: LoanInstallmentUpdate[];
}