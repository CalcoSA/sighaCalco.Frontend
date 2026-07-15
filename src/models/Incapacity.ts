export interface Incapacity {
  IdIncapacity: number;
  nameIncapacity: string | null;
  codeIncapacity: string | null;
}

export interface IncapacityCreate {
  nameIncapacity: string | null;
  codeIncapacity: string | null;
}

export interface IncapacityUpdate {
  nameIncapacity: string | null;
  codeIncapacity: string | null;
}