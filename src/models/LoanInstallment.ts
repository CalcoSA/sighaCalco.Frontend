export interface LoanInstallment {
  IdLoanInstallment: number;
  IdLoan: number;
  installmentNumber: number;
  installmentValue: number;
  isPaid: boolean;
  commitmentDate: string;
  paymentDate: string | null;
}

export interface LoanInstallmentCreate {
  installmentNumber: number;
  installmentValue: number;
  isPaid: boolean;
  commitmentDate: string;
  paymentDate: string | null;
}