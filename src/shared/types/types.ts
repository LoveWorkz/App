export interface SelectOption {
  value: string;
  label: string;
}

export type StyleType =
  | Record<string, string | number | object | undefined>
  | Record<string, string | number | object | undefined>[];

export interface DisplayText {
  en: string;
  de: string;
  pt: string;
}

export enum DocumentType {
  RUBRIC = 'rubric',
  CATEGORY = 'category',
  FAVORITE = 'favorite',
}

export type TabName =
  | 'Categories'
  | 'Rubrics'
  | 'Challenges'
  | 'Books'
  | 'Shop'
  | 'Home';
