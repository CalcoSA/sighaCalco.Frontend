export interface Bank {
  IdBank: number;
  nameBank: string | null;
  codeBank: string | null;
}

export interface BankCreate {
  nameBank: string | null;
  codeBank: string | null;
}

export interface BankUpdate {
  nameBank: string | null;
  codeBank: string | null;
}