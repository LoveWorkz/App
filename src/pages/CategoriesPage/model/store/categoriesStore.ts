import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {
  CategoryKey,
  categoryStore,
  CategoryType,
  CateorySize,
} from '@src/entities/Category';
import {Collections} from '@src/shared/types/firebase';
import {rubricStore} from '@src/entities/Rubric';
import {FavoriteType} from '@src/entities/Favorite';
import {userCategoryStore} from '@src/entities/UserCategory';
import {userStore} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {normaliseData} from '@src/shared/lib/common';
import {specialDayStore} from '@src/entities/SpecialDay';

class CategoriesStore {
  categories: CategoryType[] = [];
  categoriesMap: Record<string, CategoryType> = {};
  unlockedCategories: CategoryType[] = [];
  favorites: FavoriteType | null = null;
  isCategoriesPageLoading: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setCategories = (categories: CategoryType[]) => {
    const unlockedCategories = this.getUnlockedCategories(categories);
    const editedCategories = this.editCategories(categories as CategoryType[]);
    const normalisedCategories = normaliseData<CategoryType>(categories);

    runInAction(() => {
      this.categories = editedCategories;
      this.unlockedCategories = unlockedCategories;
      this.categoriesMap = normalisedCategories;
    });
  };

  init = async () => {
    try {
      crashlytics().log('Fetching Categories page');

      runInAction(() => {
        this.isCategoriesPageLoading = true;
      });

      await this.fetchCategories();
      await rubricStore.fetchRubrics();
      await userStore.fetchUser();
      await specialDayStore.fetchSpecialDays();
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
      const userId = userStore.userId;

      await userCategoryStore.fetchUserLevels(userId);
      // await userCategoryStore.fetchUserCategories(userId);
      await this.mergeDefaultAndUserCategories();
    } catch (e) {
      errorHandler({error: e});
    }
  };

  mergeDefaultAndUserCategories = async () => {
    try {
      crashlytics().log('Merging default and user Categories.');

      const userCategories = userCategoryStore.userCategory;
      const userLevels = userCategoryStore.userLevls;

      if (!userLevels) {
        return;
      }

      const defaultCategories = await this.fetchDefaultCategories();
      if (!defaultCategories) {
        return;
      }

      // merge default categories with user custom categories
      // const categories = defaultCategories.map(defaultCategory => {
      //   return {
      //     ...defaultCategory,
      //     ...(userCategories
      //       ? userCategories.categories[defaultCategory.id]
      //       : {}),
      //   };
      // });

      const categories = defaultCategories.map(defaultCategory => {
        return {
          ...defaultCategory,
          ...(userLevels ? userLevels[defaultCategory.id] : {}),
        };
      });

      const lastCategory = categories[categories.length - 1];
      categoryStore.setLastCategoryId(lastCategory.id);

      this.setCategories(categories);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getUnlockedCategories = (categories: CategoryType[]) => {
    const unlockedCategories = categories.filter(category => {
      return (
        !category.isBlocked &&
        category.name !== CategoryKey.How_To_Use &&
        category.name !== CategoryKey.Specials
      );
    });

    return unlockedCategories;
  };

  fetchDefaultCategories = async () => {
    try {
      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const data = await firestore()
        .collection(Collections.LEVELS)
        .orderBy('id')
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
