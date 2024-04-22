import {
  isCardTypeWild,
  isFunFact,
  isHotStuff,
  questionStore,
  QuestionType,
} from '@src/entities/QuestionCard';
import {
  funFact,
  funFactDark,
  hotStuff,
  hotStuffDark,
  questionImage1,
  questionImage2,
  questionImage3,
  questionImage4,
  questionImage5,
  questionImageDark1,
  questionImageDark2,
  questionImageDark3,
  questionImageDark4,
  questionImageDark5,
  WILD_CARD,
} from '@src/shared/assets/images';

export const getQuestionsImages = (isDarkMode: boolean) => {
  return [
    isDarkMode ? questionImageDark1 : questionImage1,
    isDarkMode ? questionImageDark2 : questionImage2,
    isDarkMode ? questionImageDark3 : questionImage3,
    isDarkMode ? questionImageDark4 : questionImage4,
    isDarkMode ? questionImageDark5 : questionImage5,
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
      if (isCardTypeWild(question.type)) {
        return {
          ...question,
          image: WILD_CARD,
        };
      }

      if (isFunFact(question.rubric?.name)) {
        const image = isDarkMode ? funFactDark : funFact;

        return {
          ...question,
          image,
        };
      }

      if (isHotStuff(question.rubric?.name)) {
        const image = isDarkMode ? hotStuffDark : hotStuff;

        return {
          ...question,
          image,
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

export const getDefaultIndex = ({
  isPreviousScreenBreak,
  defaultQuestionNumber,
  questions,
}: {
  isPreviousScreenBreak: boolean;
  defaultQuestionNumber: number;
  questions: QuestionType[];
}) => {
  if (!isPreviousScreenBreak) {
    return defaultQuestionNumber;
  }

  const questionInfo = questionStore.getQuestionInfo({
    questionId: questions[questions.length - 1].id,
    questions: questions,
  });

  if (!questionInfo) {
    return defaultQuestionNumber;
  }

  return isPreviousScreenBreak
    ? questionInfo.currentQuestionNumber
    : defaultQuestionNumber;
};
