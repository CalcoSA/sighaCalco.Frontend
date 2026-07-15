export interface Absenteeism {
  IdAbsenteeism: number;
  nameAbsenteeism: string | null;
  codeAbsenteeism: string | null;
}

export interface AbsenteeismCreate {
  nameAbsenteeism: string | null;
  codeAbsenteeism: string | null;
}

export interface AbsenteeismUpdate {
  nameAbsenteeism: string | null;
  codeAbsenteeism: string | null;
}