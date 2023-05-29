import {makeAutoObservable} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {categoryStore, CategoryType} from '@src/entities/Category';
import {rubricStore, RubricType} from '@src/entities/Rubric';
import {questionStore, QuestionType} from '@src/entities/QuestionCard';
import {userStore} from '@src/entities/User';
import {minutesDiff} from '@src/shared/lib/date';
import {getPercentageFromNumber} from '@src/shared/lib/common';
import {userRubricStore} from '@src/entities/UserRubric';
import {userCategoryStore} from '@src/entities/UserCategory';
import {DocumentType} from '@src/shared/types/types';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {breakPoint, minute} from '../consts/wowThatWasFast';

class WowThatWasFastStore {
  thatWasFastModalVisible: boolean = false;
  isThatWasFastModalForbidden: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setThatWasFastModalVisible = (isVisible: boolean) => {
    this.thatWasFastModalVisible = isVisible;
  };

  setIsThatWasFastModalForbidden = (isVisible: boolean) => {
    this.isThatWasFastModalForbidden = isVisible;
  };

  wowThatWasFastLogic = async ({
    questionId,
    documentId,
    type,
    questions,
  }: {
    questionId: string;
    documentId: string;
    type: DocumentType;
    questions: QuestionType[];
  }) => {
    try {
      crashlytics().log('Wow That Was Fast modal logic.');

      const isCategory = type === DocumentType.CATEGORY;
      let document: RubricType | CategoryType | undefined;

      if (isCategory) {
        document = await categoryStore.fetchCategory({id: documentId});
      } else {
        document = await rubricStore.fetchRubric(documentId);
      }

      if (!document) {
        return;
      }

      await this.setQuestionsSwipedInfo({
        questionId,
        documentId,
        questions,
        document,
        isCategory,
      });

      this.checkIfQuestionsSwipedFast({id: documentId, isCategory, document});
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setQuestionsSwipedInfo = async ({
    questionId,
    documentId,
    questions,
    isCategory,
    document,
  }: {
    questionId: string;
    documentId: string;
    questions: QuestionType[];
    isCategory: boolean;
    document: RubricType | CategoryType;
  }) => {
    try {
      const questionInfo = questionStore.getQuestionInfo({
        questionId: questionId,
        questions,
      });
      if (!questionInfo) {
        return;
      }

      await this.setSwipedQuestionsPercentage({
        id: documentId,
        currentQuestionIndex: questionInfo.currentQuestionNumber,
        isCategory,
        questions,
      });

      // if user swipe first time set first swipe date
      if (!document.questionSwipeStartDate) {
        this.setSwipedQuestionsDate({id: documentId, isCategory});
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  checkIfQuestionsSwipedFast = async ({
    id,
    isCategory,
    document,
  }: {
    id: string;
    isCategory: boolean;
    document: RubricType | CategoryType;
  }) => {
    try {
      // update breakPoint for next checking
      const newCheckTime = document.breakPointForCheckingDate + breakPoint;
      const allQuestionsSwipedPercentage = 100;

      // check if user swipe 30 percent
      const isCheckTime =
        document.swipedQuestionsPercentage >=
          document.breakPointForCheckingDate &&
        newCheckTime < allQuestionsSwipedPercentage;

      if (isCheckTime) {
        const currentDate = new Date();
        const diff = minutesDiff(
          currentDate,
          new Date(document.questionSwipeStartDate),
        );

        // show modal if user swiped fast than 1 minute
        if (diff <= minute && !this.isThatWasFastModalForbidden) {
          this.setThatWasFastModalVisible(true);
        }

        if (isCategory) {
          await userCategoryStore.updateUserCategory({
            id,
            field: 'breakPointForCheckingDate',
            data: newCheckTime,
          });
        } else {
          await userRubricStore.updateUserRubric({
            id,
            field: 'breakPointForCheckingDate',
            data: newCheckTime,
          });
        }

        // set current date for next checking
        this.setSwipedQuestionsDate({id, isCategory});
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setSwipedQuestionsDate = async ({
    id,
    isCategory,
  }: {
    id: string;
    isCategory: boolean;
  }) => {
    try {
      const currentDate = new Date().toJSON();

      if (isCategory) {
        await userCategoryStore.updateUserCategory({
          id,
          field: 'questionSwipeStartDate',
          data: currentDate,
        });
      } else {
        await userRubricStore.updateUserRubric({
          id,
          field: 'questionSwipeStartDate',
          data: currentDate,
        });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setSwipedQuestionsPercentage = async ({
    id,
    currentQuestionIndex,
    isCategory,
    questions,
  }: {
    id: string;
    currentQuestionIndex: number;
    isCategory: boolean;
    questions: QuestionType[];
  }) => {
    try {
      const swipedQuestionsPercentage = getPercentageFromNumber(
        currentQuestionIndex,
        questions.length,
      );

      if (!swipedQuestionsPercentage) {
        return;
      }

      if (isCategory) {
        await userCategoryStore.updateUserCategory({
          id,
          field: 'swipedQuestionsPercentage',
          data: swipedQuestionsPercentage,
        });
      } else {
        await userRubricStore.updateUserRubric({
          id,
          field: 'swipedQuestionsPercentage',
          data: swipedQuestionsPercentage,
        });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  forbidThatWasFastModalVisible = async () => {
    try {
      crashlytics().log(
        'Wow That Was Fast modal, User clicked the "Do not show again" button.',
      );

      await userStore.updateUser({
        field: 'isWowThatWasFastModalForbidden',
        data: true,
      });
      this.setIsThatWasFastModalForbidden(true);
      this.setThatWasFastModalVisible(false);
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new WowThatWasFastStore();
