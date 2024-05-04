export interface RatingResultsType {
  question_1: number;
  question_2: number;
  question_3: number;
  question_4: number;
  feedback: string;
}

export type RatingKeys = keyof RatingResultsType;

export interface RatingInformationItemType {
  id: string;
  pagekey: RatingKeys;
  image: string;
  description: string;
  pageNumber?: number;
  question?: string;
  prefix?: string;
  postfix?: string;
}
