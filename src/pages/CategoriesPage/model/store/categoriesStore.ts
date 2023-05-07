import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {CategoryType, CateorySize} from '@src/entities/Category';
import {Collections} from '@src/shared/types/firebase';
import {RubricType} from '@src/entities/Rubric';
import {FavoriteType} from '@src/entities/Favorite';
import {userStore} from '@src/entities/User';
import {profileStore} from '@src/entities/Profile';
import {userCategoryStore} from '@src/entities/UserCategory';
import {userRubricStore} from '@src/entities/UserRubric';

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
      this.isCategoriesPageLoading = true;
      // the order is important
      await userCategoryStore.fetchUserCategories();
      await userRubricStore.fetchUserRubrics();
      await this.fetchRubrics();
      await this.fetchCategories();
      await profileStore.fetchProfile();
      // init user current category for the first time
      await this.initCurrentUserCategory();
    } catch (e) {
      console.log(e);
    } finally {
      runInAction(() => {
        this.isCategoriesPageLoading = false;
      });
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

  fetchCategories = async () => {
    try {
      if (!userCategoryStore.userCategory) {
        return;
      }

      const data = await firestore()
        .collection(Collections.CATEGORIES)
        .orderBy('categoryNumber')
        .get();

      // merge default categories with user custom categories
      const categories = data.docs.map(category => {
        const currentCategory = category.data() as CategoryType;
        return {
          ...currentCategory,
          id: category.id,
          ...(userCategoryStore.userCategory
            ? userCategoryStore.userCategory.categories[category.id]
            : {}),
        };
      });

      runInAction(() => {
        this.categories = this.editCategories(categories as CategoryType[]);
      });
    } catch (e) {
      console.log(e);
    }
  };

  fetchRubrics = async () => {
    try {
      const data = await firestore()
        .collection(Collections.RUBRICS)
        .orderBy('rubricNumber')
        .get();

      // merge default rubrics with user custom rubrics
      const rubrics = data.docs.map(rubric => ({
        ...rubric.data(),
        id: rubric.id,
        ...(userRubricStore.userRubric
          ? userRubricStore.userRubric.rubrics[rubric.id]
          : {}),
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

  getNextCategory = ({currentCategoryId}: {currentCategoryId: string}) => {
    try {
      if (!currentCategoryId) {
        return;
      }

      const currentCategoryIndex = this.categories.findIndex(
        category => category.id === currentCategoryId,
      );

      if (currentCategoryIndex !== -1) {
        const nextCategory = this.categories[currentCategoryIndex + 1];

        return nextCategory;
      }
    } catch (e) {
      console.log(e);
    }
  };
}

export default new CategoriesStore();
