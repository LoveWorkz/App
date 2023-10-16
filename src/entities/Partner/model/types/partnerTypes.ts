export interface PartnerType {
  email: string;
  name: string;
  age: number;
}

export type PartnerFormType = PartnerType;

export interface PartnerFormErrorType {
  emailError: string;
  nameError: string;
  ageError: string;
}
