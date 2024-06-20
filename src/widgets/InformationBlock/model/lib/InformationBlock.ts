import {TabName} from '@src/shared/types/types';

export interface infoTextType {
  text: string;
  boldString?: string;
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
    case 'Topics':
      return {
        title: 'Browsing Topics',
        text: [
          {
            text: "Don't feel like doing a full session right now? No problem! You can browse and explore individual questions based on specific topics of interest.",
          },
          {
            text: "Just keep in mind that to track your progress and get the most out of the app, you'll want to return to the session area or start a new session from the homepage.",
          },
        ],
      };
    default:
      return {
        title: 'Session Library',
        text: [
          {
            text: 'You are currently in the Session Library. It gives you a perfect overview of the sessions in each level. The levels will unlock as you progress.',
          },
        ],
      };
  }
};
