import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {CategoryType, CateorySize} from '@src/entities/Category';
import {Collections} from '@src/shared/types/firebase';
import {RubricType} from '@src/entities/Rubric';
import {FavoriteType} from '@src/entities/Favorite';

class CategoriesStore {
  categories: CategoryType[] = [];
  rubrics: RubricType[] = [];
  favorites: FavoriteType | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchCategories = async () => {
    try {
      const data = await firestore().collection(Collections.CATEGORIES).get();
      const categories = data.docs.map(book => ({...book.data(), id: book.id}));

      runInAction(() => {
        this.categories = this.editCategories(categories as CategoryType[]);
      });
    } catch (e) {
      console.log(e);
    }
  };

  fetchRubrics = async () => {
    try {
      const data = await firestore().collection(Collections.RUBRICS).get();
      const rubrics = data.docs.map(rubric => ({
        ...rubric.data(),
        id: rubric.id,
      }));

      runInAction(() => {
        this.rubrics = rubrics as RubricType[];
      });
    } catch (e) {
      console.log(e);
    }
  };

  editCategories = (categories: CategoryType[]): CategoryType[] => {
    return categories.map((category, index) => {
      let leftSide;
      const categorySize =
        category.categorySize === 'large' ? CateorySize.XL : CateorySize.M;

      if (index % 2 === 0) {
        leftSide = true;
      } else {
        leftSide = false;
      }

      return {
        ...category,
        leftSide,
        size: categorySize,
      };
    });
  };
}

export default new CategoriesStore();
