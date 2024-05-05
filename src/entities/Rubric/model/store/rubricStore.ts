import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {categoriesStore} from '@src/pages/CategoriesPage';
import {Collections} from '@src/shared/types/firebase';
import {questionStore, QuestionType} from '@src/entities/QuestionCard';
import {userStore} from '@src/entities/User';
import {normaliseData} from '@src/shared/lib/common';
import {userRubricStore} from '@src/entities/UserRubric';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {questionsStore} from '@src/pages/QuestionsPage';
import {RubricType} from '../types/rubricTypes';

class RubricStore {
  rubric: null | RubricType = null;
  rubrics: RubricType[] = [];
  rubricsMap: Record<string, RubricType> = {};

  constructor() {
    makeAutoObservable(this);
  }

  setRubric = (rubric: RubricType) => {
    this.rubric = rubric;
  };

  initUserRubricQuestionId = async ({
    questions,
    id,
  }: {
    questions: QuestionType[];
    id: string;
  }) => {
    try {
      crashlytics().log('Initializing user rubric question id.');

      if (this.rubric?.currentQuestion) {
        return;
      }

      const firstQuestion = questions[0];

      await userRubricStore.updateUserRubric({
        id,
        field: 'currentQuestion',
        data: firstQuestion.id,
      });
      runInAction(() => {
        this.setRubric({
          ...this.rubric,
          currentQuestion: firstQuestion.id,
        } as RubricType);
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  /**
   * Updates a specific field in user rubrics and local rubric data.
   * @param {string} id - The ID of the current rubric.
   * @param {string} fieldName - The name of the field to update.
   * @param {any} fieldValue - The new value for the field.
   */
  updateRubricField = async ({
    id,
    fieldName,
    fieldValue,
  }: {
    id: string;
    fieldName: string;
    fieldValue: string | number;
  }) => {
    // Update the user rubrics with the new field value
    await userRubricStore.updateUserRubric({
      id: id,
      field: fieldName,
      data: fieldValue,
    });

    const currentRubric = this.rubric;

    // If there is a current rubric, update it with the new field value
    if (currentRubric) {
      this.setRubric({...currentRubric, [fieldName]: fieldValue});
    }
  };

  getRubric = (id: string) => {
    const currentRubric =
      this.rubrics.find(rubric => {
        return rubric.id === id;
      }) || null;

    return currentRubric;
  };

  getQuestionNumberForRubric = ({
    questionIds,
    currenctQuestionId,
  }: {
    questionIds: string[];
    currenctQuestionId: string;
  }) => {
    const questionIndex = questionIds.findIndex(
      questionId => questionId === currenctQuestionId,
    );

    const questionNumber = questionIndex !== -1 ? questionIndex + 1 : 1;
    return questionNumber;
  };

  getAndSetRubric = (id: string) => {
    try {
      const rubric = this.getRubric(id);
      if (!rubric) {
        return;
      }

      runInAction(() => {
        this.setRubric(rubric);
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getQuestionSwipeInfoForRubric = async ({
    questionId,
    questions,
  }: {
    questionId?: string;
    questions: QuestionType[];
  }) => {
    try {
      let currentquestionId = questionId;
      const isInitialSetUp = !questionId;

      // it's working only for the first time
      if (!questionId) {
        const rubric = this.rubric;
        if (!rubric) {
          return;
        }

        currentquestionId = rubric.currentQuestion;
      }
      if (!currentquestionId) {
        return;
      }

      const questionInfo = questionStore.getQuestionInfo({
        questionId: currentquestionId,
        questions,
      });

      if (!questionInfo) {
        return;
      }
      const {currentQuestion, currentQuestionNumber} = questionInfo;

      if (isInitialSetUp) {
        questionStore.setDefaultQuestionNumber(currentQuestionNumber);
      }

      questionStore.setQuestion(currentQuestion);
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

      this.setRubrics(rubrics);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setRubrics = (rubrics: RubricType[]) => {
    const normalisedRubrics = normaliseData<RubricType>(rubrics);

    runInAction(() => {
      this.rubrics = rubrics;
      this.rubricsMap = normalisedRubrics;
    });
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

  getAllQuestionsFromUnlockedCategories = () => {
    const unlockedCategories = categoriesStore.unlockedCategories;
    const unlockedCategoriesIds: string[] = [];

    unlockedCategories.forEach(category => {
      unlockedCategoriesIds.push(category.id);
    });

    const allQuestions = questionsStore.allQuestions;

    const questionsFromUnlockedCategories = allQuestions.filter(question => {
      // wild cards don't have a topics
      if (question.type === 'WILD_CARD') {
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
}

export default new RubricStore();
