export interface FavoriteType {
  ids: string[];
}

export interface QuestionFavoriteType extends FavoriteType {
  currentQuestion: string;
}

export type FavoriteKey =
  | 'question'
  | 'specialChallenge'
  | 'session'
  | 'coreChallenge';
