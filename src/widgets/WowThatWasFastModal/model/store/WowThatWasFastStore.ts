import {makeAutoObservable} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {rubricStore, RubricType} from '@src/entities/Rubric';
import {questionStore, QuestionType} from '@src/entities/QuestionCard';
import {userStore} from '@src/entities/User';
import {minutesDiff} from '@src/shared/lib/date';
import {getPercentageFromNumber} from '@src/shared/lib/common';
import {userRubricStore} from '@src/entities/UserRubric';
import {userCategoryStore} from '@src/entities/UserCategory';
import {DocumentType} from '@src/shared/types/types';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {sessionStore, SessionType} from '@src/entities/Session';
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

  getDocument = async ({
    isCategory,
    documentId,
    sessionId,
  }: {
    isCategory: boolean;
    documentId: string;
    sessionId: string;
  }) => {
    try {
      let document: RubricType | SessionType | undefined;

      if (isCategory) {
        // const category = await categoryStore.fetchCategory({id: documentId});
        const session = sessionStore.session;
        document = session as SessionType;
      } else {
        document = await rubricStore.fetchRubric(documentId);
      }

      return document;
    } catch (e) {
      errorHandler({error: e});
    }
  };

  wowThatWasFastLogic = async ({
    questionId,
    documentId,
    type,
    questions,
    sessionId,
  }: {
    questionId: string;
    documentId: string;
    type: DocumentType;
    questions: QuestionType[];
    sessionId: string;
  }) => {
    try {
      crashlytics().log('Wow That Was Fast modal logic.');

      const isCategory = type === DocumentType.CATEGORY;
      const document = await this.getDocument({
        isCategory,
        documentId,
        sessionId,
      });
      if (!document) {
        return;
      }

      await this.setQuestionsSwipedInfo({
        questionId,
        documentId,
        questions,
        document,
        isCategory,
        sessionId,
      });

      this.checkIfQuestionsSwipedFast({id: documentId, isCategory, sessionId});
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
    sessionId,
  }: {
    questionId: string;
    documentId: string;
    questions: QuestionType[];
    isCategory: boolean;
    document: RubricType | SessionType;
    sessionId: string;
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
        sessionId,
      });

      // if user swipe first time set first swipe date
      if (!document.questionSwipeStartDate) {
        this.setSwipedQuestionsDate({id: documentId, isCategory, sessionId});
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  checkIfQuestionsSwipedFast = async ({
    id,
    isCategory,
    sessionId,
  }: {
    id: string;
    isCategory: boolean;
    sessionId: string;
  }) => {
    try {
      crashlytics().log('Checking if question was scrolled fast.');

      const document = await this.getDocument({
        isCategory,
        documentId: id,
        sessionId,
      });
      if (!document) {
        return;
      }

      // update breakPoint for next checking
      const newCheckTime = document.breakPointForCheckingDate + breakPoint;
      const allQuestionsSwipedPercentage = 100;

      // if the last question modal should not be visible
      if (document.swipedQuestionsPercentage === allQuestionsSwipedPercentage) {
        return;
      }

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
          await userCategoryStore.updateUserSessions([
            {
              sessionId,
              levelId: id,
              updates: {
                breakPointForCheckingDate: newCheckTime,
              },
            },
          ]);
        } else {
          await userRubricStore.updateUserRubric({
            id,
            field: 'breakPointForCheckingDate',
            data: newCheckTime,
          });
        }

        // set current date for next checking
        this.setSwipedQuestionsDate({id, isCategory, sessionId});
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setSwipedQuestionsDate = async ({
    id,
    isCategory,
    sessionId,
  }: {
    id: string;
    isCategory: boolean;
    sessionId: string;
  }) => {
    try {
      crashlytics().log('Setting swiped questions Date.');

      const currentDate = new Date().toJSON();

      if (isCategory) {
        await userCategoryStore.updateUserSessions([
          {
            sessionId,
            levelId: id,
            updates: {
              questionSwipeStartDate: currentDate,
            },
          },
        ]);
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
    sessionId,
  }: {
    id: string;
    currentQuestionIndex: number;
    isCategory: boolean;
    questions: QuestionType[];
    sessionId: string;
  }) => {
    try {
      crashlytics().log('Setting swiped questions percentage.');

      const swipedQuestionsPercentage = getPercentageFromNumber(
        currentQuestionIndex,
        questions.length,
      );

      if (!swipedQuestionsPercentage) {
        return;
      }

      if (isCategory) {
        await userCategoryStore.updateUserSessions([
          {
            sessionId,
            levelId: id,
            updates: {
              swipedQuestionsPercentage: swipedQuestionsPercentage,
            },
          },
        ]);
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
