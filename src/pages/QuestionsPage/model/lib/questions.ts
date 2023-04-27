import {QuestionType} from '@src/entities/QuestionCard';
import {
  Action_CARD,
  questionImage1,
  questionImage2,
  questionImage3,
  questionImage4,
  questionImage5,
  questionImage6,
  WILD_CARD,
} from '@src/shared/assets/images';

export const counts = [3, 6];
export const minute = 1;
export const breakPoint = 30;

export const questionsImages = [
  questionImage1,
  questionImage2,
  questionImage3,
  questionImage4,
  questionImage5,
  questionImage6,
];

export const getFormattedQuestionsWrapper = (questions: QuestionType[]) => {
  return () => {
    let index = 0;

    return questions.map(question => {
      if (question.type === 'WILD_CARD') {
        return {
          ...question,
          image: WILD_CARD,
        };
      }

      if (question.type === 'Action_CARD') {
        return {
          ...question,
          image: Action_CARD,
        };
      }

      const questionsImagesLength = questionsImages.length;

      // reset index to select image from the beginning
      if (questionsImagesLength <= index) {
        index = 0;
      }

      const newQuestions = {
        ...question,
        image: questionsImages[index],
      };

      index++;

      return newQuestions;
    });
  };
};
