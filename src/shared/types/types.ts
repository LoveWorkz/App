export interface SelectOption {
  value: string;
  label: string;
}

export type StyleType =
  | Record<string, string | number | object | undefined>
  | Record<string, string | number | object | undefined>[];
