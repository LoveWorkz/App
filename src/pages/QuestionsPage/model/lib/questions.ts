import {goodMoodQuestionCard, QuestionType} from '@src/entities/QuestionCard';
import {
  Action_CARD,
  questionImage1,
  questionImage2,
  questionImage3,
  questionImage4,
  questionImage5,
  questionImage6,
  questionImageDark1,
  questionImageDark2,
  questionImageDark3,
  questionImageDark4,
  questionImageDark5,
  questionImageDark6,
  WILD_CARD,
} from '@src/shared/assets/images';
import {getDefaultIndexForCarousel} from '@src/shared/lib/common';

export const getQuestionsImages = (isDarkMode: boolean) => {
  return [
    isDarkMode ? questionImageDark1 : questionImage1,
    isDarkMode ? questionImageDark2 : questionImage2,
    isDarkMode ? questionImageDark3 : questionImage3,
    isDarkMode ? questionImageDark4 : questionImage4,
    isDarkMode ? questionImageDark5 : questionImage5,
    isDarkMode ? questionImageDark6 : questionImage6,
  ];
};

export const getFormattedQuestionsWrapper = ({
  questions,
  isDarkMode,
}: {
  questions: QuestionType[];
  isDarkMode: boolean;
}) => {
  let index = 0;

  return () => {
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

      const questionsImages = getQuestionsImages(isDarkMode);
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

export const getGoodMoodQuestionCard = (
  questions: QuestionType[],
  index?: number,
): QuestionType[] => {
  const defaultIndex = getDefaultIndexForCarousel(index);

  const currentQuestion = questions.find((_, i) => i === defaultIndex);
  if (!currentQuestion) {
    return [];
  }

  return [
    currentQuestion,
    {...goodMoodQuestionCard, image: currentQuestion.image},
    currentQuestion,
  ];
};
