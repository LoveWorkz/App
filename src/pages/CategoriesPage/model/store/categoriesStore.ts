import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import {TFunction} from 'i18next';

import {
  CategoryType,
  CateorySize,
  translateCategory,
  UserCategory,
} from '@src/entities/Category';
import {Collections} from '@src/shared/types/firebase';
import {RubricType, UserRubric} from '@src/entities/Rubric';
import {FavoriteType} from '@src/entities/Favorite';
import {userStore} from '@src/entities/User';
import {profileStore} from '@src/entities/Profile';

class CategoriesStore {
  categories: CategoryType[] = [];
  rubrics: RubricType[] = [];
  favorites: FavoriteType | null = null;
  userCategory: null | UserCategory = null;
  userRubric: null | UserRubric = null;

  constructor() {
    makeAutoObservable(this);
  }

  init = async (t: TFunction) => {
    try {
      await this.fetchUserCategories();
      await this.fetchUserRubrics();
      await this.fetchRubrics();
      await this.fetchCategories(t);
      await profileStore.fetchProfile();
      // init user current category for the first time
      await this.initCurrentUserCategory();
    } catch (e) {
      console.log(e);
    }
  };

  initCurrentUserCategory = async () => {
    try {
      const firstCategory = this.categories[0];
      const currentUserCategory = profileStore.currentCategory;

      if (currentUserCategory?.currentCategory) {
        return;
      }

      const currentUserCategoryData = {
        currentCategory: firstCategory.name,
        currentCategoryId: firstCategory.id,
      };

      profileStore.setCurrentCategory(currentUserCategoryData);
      userStore.updateUser({
        field: 'category',
        data: currentUserCategoryData,
      });
    } catch (e) {
      console.log(e);
    }
  };

  fetchUserCategories = async () => {
    try {
      const userId = userStore.authUserId;
      if (!userId) {
        return;
      }

      const data = await firestore()
        .collection(Collections.USER_CATEGORIES)
        .doc(userId)
        .get();

      runInAction(() => {
        this.userCategory = data.data() as UserCategory;
      });
    } catch (e) {
      console.log(e);
    }
  };

  fetchUserRubrics = async () => {
    try {
      const userId = userStore.authUserId;
      if (!userId) {
        return;
      }

      const data = await firestore()
        .collection(Collections.USER_RUBRICS)
        .doc(userId)
        .get();

      runInAction(() => {
        this.userRubric = data.data() as UserRubric;
      });
    } catch (e) {
      console.log(e);
    }
  };

  fetchCategories = async (t: TFunction) => {
    try {
      if (!this.userCategory) {
        return;
      }

      const data = await firestore().collection(Collections.CATEGORIES).get();

      // merge default categories with user custom categories
      const categories = data.docs.map(category => {
        const currentCategory = category.data() as CategoryType;
        return {
          ...currentCategory,
          id: category.id,
          ...(this.userCategory
            ? this.userCategory.categories[category.id]
            : {}),
        };
      });

      const translatedCategories = categories.map(category => {
        return {
          ...category,
          name: translateCategory({t, name: category.name}),
        };
      });

      runInAction(() => {
        this.categories = this.editCategories(
          translatedCategories as CategoryType[],
        );
      });
    } catch (e) {
      console.log(e);
    }
  };

  fetchRubrics = async () => {
    try {
      const data = await firestore().collection(Collections.RUBRICS).get();

      // merge default rubrics with user custom rubrics
      const rubrics = data.docs.map(rubric => ({
        ...rubric.data(),
        id: rubric.id,
        ...(this.userRubric ? this.userRubric.rubrics[rubric.id] : {}),
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
