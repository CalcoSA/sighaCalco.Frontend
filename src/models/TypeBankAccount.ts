export interface TypeBankAccount {
  IdTypeBankAccount: number;
  nameTypeBankAccount: string | null;
  codeTypeBankAccount: string | null;
}

export interface TypeBankAccountCreate {
  nameTypeBankAccount: string | null;
  codeTypeBankAccount: string | null;
}

export interface TypeBankAccountUpdate {
  nameTypeBankAccount: string | null;
  codeTypeBankAccount: string | null;
}