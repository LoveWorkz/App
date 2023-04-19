import {QuestionType} from '@src/entities/QuestionCard';
import {TFunction} from 'i18next';

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

export const getCongratsModalContent = (t: TFunction) => {
  const title = t('questions.congrats_for_reached_next_category');
  return {
    Starter: {
      title: `${title} Starter:`,
      description: `${t('questions.reward_challanges')} Silver`,
    },
    Basic: {
      title: `${title} Basic:`,
      description: `${t('questions.reward_challanges')} Silver`,
    },
    Deep: {
      title: `${title} Deep:`,
      description: `${t('questions.reward_challanges')} Gold`,
    },
    Intimate: {
      title: `${title} Intimate:`,
      description: `${t('questions.reward_challanges')} Diamond`,
    },
    Hot: {
      title: `${title} Hot:`,
      description: `${t('questions.reward_challanges')} Platinum`,
    },
  };
};
