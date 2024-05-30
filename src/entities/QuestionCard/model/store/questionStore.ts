import {makeAutoObservable} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {Collections} from '@src/shared/types/firebase';
import {EnrichQuestionsParams, QuestionType} from '../types/questionTypes';

class QuestionStore {
  question: null | QuestionType = null;
  defaultQuestionNumber: number = 0;
  questionCardScreenshot: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  setQuestionCardScreenshot = (url: string) => {
    this.questionCardScreenshot = url;
  };

  setDefaultQuestionNumber = (number: number) => {
    this.defaultQuestionNumber = number;
  };

  getQuestionInfo = ({
    questionId,
    questions,
  }: {
    questionId: string;
    questions: QuestionType[];
  }) => {
    try {
      const currentQuestion = this.getQuestionById({
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

  setQuestion = (question: QuestionType) => {
    this.question = question;
  };

  getQuestionById = ({
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

  enrichQuestionsWithDetails = ({
    questions,
    categoriesMap = {},
    rubricsMap = {},
  }: EnrichQuestionsParams): QuestionType[] => {
    return questions.map(question => {
      const category = categoriesMap[question.categoryId];
      const rubric = rubricsMap[question.rubricId];

      return {
        ...question,
        category: category ?? null,
        rubric: rubric ?? null,
      };
    });
  };

  incrementQuestionViewCount = (questionId: string) => {
    try {
      const questionRef = firestore()
        .collection(Collections.ORDINARY_QUESTIONS)
        .doc(questionId);
      questionRef.update({
        viewCount: firestore.FieldValue.increment(1),
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new QuestionStore();
