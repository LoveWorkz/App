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

  displayedLevels: CategoryType[] = [];
  displayedLevelsMap: Record<string, CategoryType> = {};

  constructor() {
    makeAutoObservable(this);
  }

  setCategories = (levels: CategoryType[]) => {
    const editedCategories = this.editCategories(levels as CategoryType[]);
    // delete "How To Use" and "Special" blocks because there not a levels
    const levelsMinusHotAndSpecial =
      this.getLevelsMinusHotAndSpecial(editedCategories);
    const unlockedCategories = this.getUnlockedCategories(
      levelsMinusHotAndSpecial,
    );
    const normalisedCategories = normaliseData<CategoryType>(
      levelsMinusHotAndSpecial,
    );
    const displayedLevelsMap = normaliseData<CategoryType>(editedCategories);

    runInAction(() => {
      this.categories = levelsMinusHotAndSpecial;
      this.unlockedCategories = unlockedCategories;
      this.categoriesMap = normalisedCategories;
      this.displayedLevels = editedCategories;
      this.displayedLevelsMap = displayedLevelsMap;
    });
  };

  getLevelsMinusHotAndSpecial = (levels: CategoryType[]) => {
    return levels.filter(
      level =>
        level.name !== CategoryKey.Specials &&
        level.name !== CategoryKey.How_To_Use,
    );
  };

  init = async () => {
    try {
      crashlytics().log('Fetching Categories page');

      runInAction(() => {
        this.isCategoriesPageLoading = true;
      });

      await this.fetchCategories();
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
      await this.mergeDefaultAndUserCategories();
    } catch (e) {
      errorHandler({error: e});
    }
  };

  mergeDefaultAndUserCategories = async () => {
    try {
      crashlytics().log('Merging default and user Categories.');

      const userLevels = userCategoryStore.userLevels;

      if (!userLevels) {
        return;
      }

      const defaultCategories = await this.fetchDefaultCategories();
      if (!defaultCategories) {
        return;
      }

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
    const unlockedCategories = categories.filter(
      category => !category.isBlocked,
    );

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
