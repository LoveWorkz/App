import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {categoriesStore} from '@src/pages/CategoriesPage';
import {Collections} from '@src/shared/types/firebase';
import {questionStore, QuestionType} from '@src/entities/QuestionCard';
import {categoryStore} from '@src/entities/Category';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {userStore} from '@src/entities/User';
import {userRubricStore} from '@src/entities/UserRubric';
import {RubricType} from '../types/rubricTypes';

class RubricStore {
  rubric: null | RubricType = null;
  constructor() {
    makeAutoObservable(this);
  }

  initUserRubricQuestionId = async ({
    questions,
    id,
  }: {
    questions: QuestionType[];
    id: string;
  }) => {
    try {
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
        this.rubric = {
          ...this.rubric,
          currentQuestion: firstQuestion.id,
        } as RubricType;
      });
    } catch (e) {
      console.log(e);
    }
  };

  getRubric = (id: string) => {
    try {
      const currentRubric =
        categoriesStore.rubrics.find(rubric => {
          return rubric.id === id;
        }) || null;

      return currentRubric;
    } catch (e) {
      console.log(e);
    }
  };

  getAndSetRubric = (id: string) => {
    try {
      const rubric = this.getRubric(id);

      if (!rubric) {
        return;
      }

      runInAction(() => {
        this.rubric = rubric;
      });
    } catch (e) {
      console.log(e);
    }
  };

  fetchRubric = async (id: string) => {
    try {
      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const userId = userStore.authUserId;
      if (!userId) {
        return;
      }
      // default rubric
      const data = await firestore()
        .collection(Collections.RUBRICS)
        .doc(id)
        .get({source});
      // user custom rubric
      const userRubricData = await firestore()
        .collection(Collections.USER_RUBRICS)
        .doc(userId)
        .get({source});

      const userRubric = userRubricData.data();
      if (!userRubric) {
        return;
      }
      // merge default rubric with user custom rubric
      const rubric = {
        ...data.data(),
        id: data.id,
        ...userRubric.rubrics[id],
      } as RubricType;

      runInAction(() => {
        this.rubric = rubric;
      });
      return rubric;
    } catch (e) {
      console.log(e);
    }
  };

  getQuestionSwipeInfoForRubric = async ({
    questionId,
    language,
    questions,
  }: {
    language: LanguageValueType;
    questionId?: string;
    questions: QuestionType[];
  }) => {
    try {
      let currentquestionId = questionId;
      let rubricName: string | undefined;

      // it's working only for the first time
      if (!questionId) {
        const rubric = this.rubric;
        if (!rubric) {
          return;
        }

        currentquestionId = rubric.currentQuestion;
        rubricName = rubric.displayName[language];
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

      const currentCategory = categoryStore.getCategory(
        currentQuestion?.categoryId,
      );
      if (!currentCategory) {
        return;
      }

      questionStore.setQuestionPreviewInfo({
        categoryName: currentCategory.displayName[language],
        rubricName: rubricName || questionStore.questionPreviewInfo.rubricName,
        questionNumber: currentQuestionNumber,
      });
    } catch (e) {
      console.log(e);
    }
  };
}

export default new RubricStore();
