export interface SubCategories {
  DEEP: string[];
  HOT: string[];
  INTENSIFY: string[];
  WARM_UP: string[];
}

export type SubCategoriesKeys = keyof SubCategories;

export interface SessionType {
  // change to challenge
  challange: string;
  subCategories: SubCategories;
  id: string;
  sessionNumber: number;
}
