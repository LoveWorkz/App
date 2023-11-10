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
import {RubricType} from '@src/entities/Rubric';
import {FavoriteType} from '@src/entities/Favorite';
import {userCategoryStore} from '@src/entities/UserCategory';
import {userRubricStore} from '@src/entities/UserRubric';
import {userStore} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {questionsStore} from '@src/pages/QuestionsPage';
import {QuestionType} from '@src/entities/QuestionCard';
import {normaliseData} from '@src/shared/lib/common';
import {specialDayStore} from '@src/entities/SpecialDay';

class CategoriesStore {
  categories: CategoryType[] = [];
  categoriesMap: Record<string, CategoryType> = {};
  unlockedCategories: CategoryType[] = [];
  rubrics: RubricType[] = [];
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
      await this.fetchRubrics();
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
        category.name !== CategoryKey.All_In_One &&
        category.name !== CategoryKey.Specials
      );
    });

    return unlockedCategories;
  };

  fetchDefaultCategories = async () => {
    try {
      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const data = await firestore()
        .collection(Collections.CATEGORIES_2)
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

      const questionsFromUnlockedCategories =
        this.getAllQuestionsFromUnlockedCategories();

      const rubricQuestionsMap = this.getRubricQuestionsMap(
        questionsFromUnlockedCategories,
      );

      // merge default rubrics with user custom rubrics
      const rubrics = defaultRubrics.map(rubric => {
        const questionIds = rubricQuestionsMap[rubric.id];

        return {
          ...rubric,
          ...userRubrics.rubrics[rubric.id],
          // add dynamically questions from unlocked categories
          questions: [...rubric.questions, ...(questionIds || [])],
        };
      });

      runInAction(() => {
        this.rubrics = rubrics as RubricType[];
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getAllQuestionsFromUnlockedCategories = () => {
    const unlockedCategories = this.unlockedCategories;
    const unlockedCategoriesIds: string[] = [];

    unlockedCategories.forEach(category => {
      unlockedCategoriesIds.push(category.id);
    });

    const allQuestions = questionsStore.allQuestions;

    const questionsFromUnlockedCategories = allQuestions.filter(question => {
      // wild and challenge cards don't have a topics
      if (question.type === 'CHALLENGE_CARD' || question.type === 'WILD_CARD') {
        return false;
      }

      return unlockedCategoriesIds.includes(question.categoryId);
    });

    // the order should be “Starter”, “Basic” and other categories.
    const sortedQuestions = questionsFromUnlockedCategories.sort((a, b) => {
      const numA = a.categoryId.split('_')[1];
      const numB = b.categoryId.split('_')[1];
      return Number(numA) - Number(numB);
    });

    return sortedQuestions;
  };

  getRubricQuestionsMap = (questionsFromUnlockedCategories: QuestionType[]) => {
    const rubricQuestionsMap: Record<string, string[]> = {};

    questionsFromUnlockedCategories.forEach(item => {
      const rubricId = item.rubricId;

      rubricQuestionsMap[rubricId] = [
        ...(rubricQuestionsMap[rubricId] || []),
        item.id,
      ];
    });

    return rubricQuestionsMap;
  };

  fetchDefaultRubrics = async () => {
    try {
      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const data = await firestore()
        .collection(Collections.RUBRICS)
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
