export interface LoanScheduled {
  executionDate: string;
  cycleName: string;
  targetInstallmentDate: string;
  reviewedLoans: number;
  activatedLoans: number;
  paidInstallments: number;
  finishedLoans: number;
  skippedLoans: number;
  failedLoans: number;
  processedLoanIds: number[];
  errors: string[];
}