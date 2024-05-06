import {makeAutoObservable} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {rubricStore, RubricType} from '@src/entities/Rubric';
import {questionStore, QuestionType} from '@src/entities/QuestionCard';
import {userStore} from '@src/entities/User';
import {minutesDiff} from '@src/shared/lib/date';
import {getPercentageFromNumber} from '@src/shared/lib/common';
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

  getDocument = ({isCategory}: {isCategory: boolean}) => {
    try {
      let document: RubricType | SessionType | undefined;

      if (isCategory) {
        document = sessionStore.session as SessionType;
      } else {
        document = rubricStore.rubric as RubricType;
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
    sessionId?: string;
  }) => {
    try {
      crashlytics().log('Wow That Was Fast modal logic.');

      const isCategory = type === DocumentType.CATEGORY;

      const document = this.getDocument({
        isCategory,
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
    sessionId?: string;
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
        document,
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
    sessionId?: string;
  }) => {
    try {
      crashlytics().log('Checking if question was scrolled fast.');

      const document = this.getDocument({
        isCategory,
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
          if (!sessionId) {
            return;
          }

          await sessionStore.updateSessionField({
            levelId: id,
            sessionId,
            fieldName: 'breakPointForCheckingDate',
            fieldValue: newCheckTime,
          });
        } else {
          await rubricStore.updateRubricField({
            id,
            fieldName: 'breakPointForCheckingDate',
            fieldValue: newCheckTime,
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
    sessionId?: string;
  }) => {
    try {
      crashlytics().log('Setting swiped questions Date.');

      const currentDate = new Date().toJSON();

      if (isCategory) {
        if (!sessionId) {
          return;
        }

        await sessionStore.updateSessionField({
          levelId: id,
          sessionId,
          fieldName: 'questionSwipeStartDate',
          fieldValue: currentDate,
        });
      } else {
        await rubricStore.updateRubricField({
          id,
          fieldName: 'questionSwipeStartDate',
          fieldValue: currentDate,
        });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setSwipedQuestionsPercentage = async ({
    id,
    document,
    currentQuestionIndex,
    isCategory,
    questions,
    sessionId,
  }: {
    id: string;
    document: RubricType | SessionType;
    currentQuestionIndex: number;
    isCategory: boolean;
    questions: QuestionType[];
    sessionId?: string;
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

      // no need to update percentage if go back
      if (document.swipedQuestionsPercentage >= swipedQuestionsPercentage) {
        return;
      }

      if (isCategory) {
        if (!sessionId) {
          return;
        }

        await sessionStore.updateSessionField({
          levelId: id,
          sessionId,
          fieldName: 'swipedQuestionsPercentage',
          fieldValue: swipedQuestionsPercentage,
        });
      } else {
        await rubricStore.updateRubricField({
          id,
          fieldName: 'swipedQuestionsPercentage',
          fieldValue: swipedQuestionsPercentage,
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
