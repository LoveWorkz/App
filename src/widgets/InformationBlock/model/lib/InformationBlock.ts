import {TabName} from '@src/shared/types/types';

export interface infoTextType {
  text: string;
  boldString: string;
}

interface InformationBlockContentType {
  title: string;
  text: infoTextType[];
}

export const getInformationBlockContent = (
  tabName: TabName,
): InformationBlockContentType => {
  switch (tabName) {
    case 'Books':
      return {
        title: 'Welcome to the literature Section',
        text: [
          {
            boldString: 'Each book',
            text: ' you find here is a standout gem, highly recommended by  therapists and handpicked by our team.',
          },
          {
            boldString: 'Scientifically',
            text: ' backed, filled with evidence-based insights, tips and exercises, these books will help you improve communication, increase mutual understanding, deepen emotional bonds, and navigate through your relationship challenges.',
          },
          {
            boldString: 'Each title',
            text: ' is categorized and comes with a short explanation, assisting you in discovering the perfect resource to enrich your partnership',
          },
        ],
      };
    case 'Challenges':
      return {
        title: 'Challenges',
        text: [
          {
            boldString: 'Each book',
            text: ' Challenges',
          },
        ],
      };
    case 'Rubrics':
      return {
        title: 'Browsing Topics!',
        text: [
          {
            boldString: 'You',
            text: ' are currently in the Topic Section. Here you can start browsing questions & exploring based on specific subjects of interest.',
          },
          {
            boldString: 'To',
            text: ' make In-App-progress, please return to the session area above or start the game from the homepage.',
          },
        ],
      };
    default:
      return {
        title: 'Question Library',
        text: [
          {
            boldString: 'You',
            text: ' are currently in the Question Library. It gives you a perfect overview of the the sessions per category. The categories will unlock as you progress.',
          },
        ],
      };
  }
};
