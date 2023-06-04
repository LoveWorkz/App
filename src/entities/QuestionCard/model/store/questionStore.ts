import {makeAutoObservable, runInAction} from 'mobx';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {QuestionPreviewType, QuestionType} from '../types/questionTypes';

class QuestionStore {
  question: null | QuestionType = null;
  questionPreviewInfo: QuestionPreviewType = {
    categoryName: '',
    rubricName: '',
    questionNumber: 0,
    defaultQuestionNumber: 0,
  };
  questionCardScreenshot: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  setQuestionPreviewInfo = (questionPreviewInfo: QuestionPreviewType) => {
    try {
      runInAction(() => {
        this.questionPreviewInfo = this.questionPreviewInfo = {
          ...this.questionPreviewInfo,
          ...questionPreviewInfo,
        };
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };
  setQuestionCardScreenshot = (url: string) => {
    this.questionCardScreenshot = url;
  };

  getQuestionInfo = ({
    questionId,
    questions,
  }: {
    questionId: string;
    questions: QuestionType[];
  }) => {
    try {
      const currentQuestion = this.getAndSetQuestionById({
        questionId,
        questions,
      });
      if (!currentQuestion) {
        return;
      }

      const currentQuestionIndex = this.getQuestionIndex({
        questionId,
        questions,
      });
      if (typeof currentQuestionIndex !== 'number') {
        return;
      }

      return {currentQuestion, currentQuestionNumber: currentQuestionIndex + 1};
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getAndSetQuestionById = ({
    questionId,
    questions,
  }: {
    questionId: string;
    questions: QuestionType[];
  }) => {
    try {
      const currentQuestion = questions.find(
        question => question.id === questionId,
      );

      runInAction(() => {
        this.question = currentQuestion || null;
      });
      return currentQuestion;
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getQuestionIndex = ({
    questionId,
    questions,
  }: {
    questionId: string;
    questions: QuestionType[];
  }) => {
    try {
      return questions.findIndex(question => question.id === questionId);
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new QuestionStore();
