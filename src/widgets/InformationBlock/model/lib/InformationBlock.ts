import {TabName} from '@src/shared/types/types';
import {t} from 'i18next';

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
        title: t('information_block.literature'),
        text: [
          {
            boldString: t('information_block.literature_title_1'),
            text: t('information_block.literature_text_1'),
          },
          {
            boldString: t('information_block.literature_title_2'),
            text: t('information_block.literature_text_2'),
          },
          {
            boldString: t('information_block.literature_title_3'),
            text: t('information_block.literature_text_3'),
          },
        ],
      };
    case 'Challenges':
      return {
        title: t('information_block.challenges'),
        text: [
          {
            boldString: t('information_block.challenges_title_1'),
            text: t('information_block.challenges_text_1'),
          },
        ],
      };
    case 'Topics':
      return {
        title: t('information_block.browsing_topics'),
        text: [
          {
            text: t('information_block.browsing_topics_text_1'),
          },
          {
            text: t('information_block.browsing_topics_text_2'),
          },
        ],
      };
    default:
      return {
        title: t('information_block.session_library'),
        text: [
          {
            text: t('information_block.session_library_text_1'),
          },
        ],
      };
  }
};
