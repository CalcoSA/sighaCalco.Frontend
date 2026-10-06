export interface LoanExportQuery {
  employeeDocumentNumber?: string;
  IdLoanStatus?: number;
  IdConcept?: number;
  requestDateFrom?: string;
  requestDateTo?: string;
}

export interface LoanExport {
  IdLoan: number;
  employeeDocumentNumber: string;
  employeeFullName: string;
  employeeRoleName: string | null;
  employeeCostCenterName: string | null;
  isLoan: boolean;
  crossDocument: string | null;
  conceptName: string;
  deductionPlanName: string;
  loanStatusName: string;
  loanAmount: | number | string | null;
  serviceValue: | number | string | null;
  numberInstallments: | number | null;
  paidInstallments: | number | null;
  remainingAmount: | number | string | null;
  requestDate: string;
  startDiscountDate: string;
  endDiscountDate: | string | null;
  installmentNumber: | number | null;
  installmentValue: | number | string | null;
  isPaid: | boolean | null;
  commitmentDate: | string | null;
  paymentDate: | string | null;
  serviceDiscountValue: | number | string | null;
  serviceDiscountDate: | string | null;
}