import {QuestionType} from '@src/entities/QuestionCard';

export const counts = [3, 6];
export const minute = 1;
export const breakPoint = 30;

export const questionsImages = [
  'http://localhost:8081/src/shared/assets/images/questionImage1.png',
  'http://localhost:8081/src/shared/assets/images/questionImage2.png',
  'http://localhost:8081/src/shared/assets/images/questionImage3.png',
  'http://localhost:8081/src/shared/assets/images/questionImage4.png',
  'http://localhost:8081/src/shared/assets/images/questionImage5.png',
  'http://localhost:8081/src/shared/assets/images/questionImage6.png',
];

export const getFormattedQuestionsWrapper = (questions: QuestionType[]) => {
  return () => {
    let index = 0;

    return questions.map(question => {
      if (question.type === 'WILD_CARD') {
        return {
          ...question,
          image: 'http://localhost:8081/src/shared/assets/images/WILD_CARD.png',
        };
      }

      if (question.type === 'Action_CARD') {
        return {
          ...question,
          image:
            'http://localhost:8081/src/shared/assets/images/Action_CARD.png',
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
