import {FavoriteType} from '@src/entities/Favorite';
import {RubricType} from '@src/entities/Rubric';

export interface UserRubric {
  rubrics: Record<string, Partial<RubricType>>;
  userId: string;
  favorites: FavoriteType;
}
