import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {CategoryType, CateorySize} from '@src/entities/Category';
import {Collections} from '@src/shared/types/firebase';
import {RubricType} from '@src/entities/Rubric';
import {FavoriteType} from '@src/entities/Favorite';
import {userCategoryStore} from '@src/entities/UserCategory';
import {userRubricStore} from '@src/entities/UserRubric';
import {userStore} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';

class CategoriesStore {
  categories: CategoryType[] = [];
  rubrics: RubricType[] = [];
  favorites: FavoriteType | null = null;
  isCategoriesPageLoading: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  init = async () => {
    try {
      crashlytics().log('Fetching Categories page');

      runInAction(() => {
        this.isCategoriesPageLoading = true;
      });
      await this.fetchRubrics();
      await this.fetchCategories();
      await userStore.fetchUser();
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isCategoriesPageLoading = false;
      });
    }
  };

  fetchCategories = async () => {
    try {
      crashlytics().log('Fetching Categories');

      await userCategoryStore.fetchUserCategories();
      await this.mergeDefaultAndUserCategories();
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchRubrics = async () => {
    try {
      crashlytics().log('Fetching Rubrics');

      await userRubricStore.fetchUserRubrics();
      await this.mergeDefaultAndUserRubrics();
    } catch (e) {
      errorHandler({error: e});
    }
  };

  mergeDefaultAndUserCategories = async () => {
    try {
      crashlytics().log('Merging default and user Categories.');

      const userCategories = userCategoryStore.userCategory;
      if (!userCategories) {
        return;
      }

      const defaultCategories = await this.fetchDefaultCategories();
      if (!defaultCategories) {
        return;
      }

      // merge default categories with user custom categories
      const categories = defaultCategories.map(defaultCategory => {
        return {
          ...defaultCategory,
          ...(userCategories
            ? userCategories.categories[defaultCategory.id]
            : {}),
        };
      });

      runInAction(() => {
        this.categories = this.editCategories(categories as CategoryType[]);
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchDefaultCategories = async () => {
    try {
      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const data = await firestore()
        .collection(Collections.CATEGORIES)
        .orderBy('createdDate')
        .get({source});

      const categories = data.docs.map(category => {
        const currentCategory = category.data() as CategoryType;
        return {
          ...currentCategory,
        };
      });

      return categories;
    } catch (e) {
      errorHandler({error: e});
    }
  };

  mergeDefaultAndUserRubrics = async () => {
    try {
      crashlytics().log('Merging default and user Rubrics.');

      const userRubrics = userRubricStore.userRubric;
      if (!userRubrics) {
        return;
      }

      const defaultRubrics = await this.fetchDefaultRubrics();
      if (!defaultRubrics) {
        return;
      }

      // merge default rubrics with user custom rubrics
      const rubrics = defaultRubrics.map(rubric => ({
        ...rubric,
        ...userRubrics.rubrics[rubric.id],
      }));

      runInAction(() => {
        this.rubrics = rubrics as RubricType[];
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchDefaultRubrics = async () => {
    try {
      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const data = await firestore()
        .collection(Collections.RUBRICS)
        .orderBy('createdDate')
        .get({source});

      const rubrics = data.docs.map(rubric => {
        return {
          ...(rubric.data() as RubricType),
          id: rubric.id,
        };
      });

      return rubrics;
    } catch (e) {
      errorHandler({error: e});
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

  toggleCategoryPurchasedStatus = async (isBlocked: boolean) => {
    try {
      const promises: Promise<void>[] = [];

      this.categories.map(category => {
        const promise = userCategoryStore.updateUserCategory({
          id: category.id,
          field: 'isBlocked',
          data: isBlocked,
        });

        promises.push(promise);
      });

      Promise.all(promises);
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new CategoriesStore();
