export interface LoanScheduled {
  executionDate: string;
  cycleName: string;
  targetInstallmentDate: string;
  reviewedLoans: number;
  reviewedServices: number;
  activatedLoans: number;
  activatedServices: number;
  paidInstallments: number;
  serviceDiscounts: number;
  finishedLoans: number;
  skippedLoans: number;
  skippedServices: number;
  failedLoans: number;
  failedServices: number;
  processedLoanIds: number[];
  errors: string[];
}