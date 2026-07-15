export interface Diagnosis {
  IdDiagnosis: number;
  nameDiagnosis: string | null;
  codeDiagnosis: string | null;
}

export interface DiagnosisCreate {
  IdDiagnosis: number;
  nameDiagnosis: string | null;
  codeDiagnosis: string | null;
}

export interface DiagnosisUpdate {
  nameDiagnosis: string | null;
  codeDiagnosis: string | null;
}