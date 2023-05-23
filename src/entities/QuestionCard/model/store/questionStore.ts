import {makeAutoObservable} from 'mobx';
import {QuestionType} from '../types/questionTypes';

class QuestionStore {
  question: null | QuestionType = null;

  constructor() {
    makeAutoObservable(this);
  }

  getQuestionInfo = ({
    questionId,
    questions,
  }: {
    questionId: string;
    questions: QuestionType[];
  }) => {
    try {
      const currentQuestion = this.getQuestionById({questionId, questions});
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
      console.log(e);
    }
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
      this.question = currentQuestion || null;
      return currentQuestion;
    } catch (e) {
      console.log(e);
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
      console.log(e);
    }
  };
}

export default new QuestionStore();
