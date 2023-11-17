import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  ChallengeCard,
  ChallengeDescription,
  ChallengeDetailsColumns,
  ChallengeIntroCard,
} from '@src/entities/Challenge';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';

interface VocabularyOfFeelContentProps {
  data: any;
}

export const VocabularyOfFeelContent = (
  props: VocabularyOfFeelContentProps,
) => {
  const {data} = props;

  const {i18n} = useTranslation();
  const language = i18n.language as LanguageValueType;

  let content;

  switch (data.type) {
    case 'intro':
      content = (
        <ChallengeIntroCard title={data.title} description={data.description} />
      );
      break;
    case 'data_1':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDescription
            gradientWordscount={1}
            description={data.description1[language]}
            isMarginBottom
          />
          <ChallengeDescription
            gradientWordscount={1}
            description={data.description2[language]}
          />
        </ChallengeCard>
      );
      break;
    case 'data_2':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDescription description={data.description1[language]} />
        </ChallengeCard>
      );
      break;
    case 'data_3':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDetailsColumns
            firstColumn={data.column1[language]}
            secondColumn={data.column2[language]}
          />
        </ChallengeCard>
      );
      break;
    case 'data_4':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDetailsColumns
            firstColumn={data.column1[language]}
            secondColumn={data.column2[language]}
          />
        </ChallengeCard>
      );
      break;
    case 'data_5':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDetailsColumns
            firstColumn={data.column1[language]}
            secondColumn={data.column2[language]}
            thirdColumn={data.column3[language]}
          />
        </ChallengeCard>
      );
      break;
    case 'data_6':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDetailsColumns
            firstColumn={data.column1[language]}
            secondColumn={data.column2[language]}
          />
        </ChallengeCard>
      );
      break;
    case 'data_7':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDetailsColumns
            firstColumn={data.column1[language]}
            secondColumn={data.column2[language]}
          />
        </ChallengeCard>
      );
      break;
    case 'data_8':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDetailsColumns
            firstColumn={data.column1[language]}
            secondColumn={data.column2[language]}
          />
        </ChallengeCard>
      );
      break;
    case 'data_9':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDetailsColumns
            firstColumn={data.column1[language]}
            secondColumn={data.column2[language]}
          />
        </ChallengeCard>
      );
      break;
    case 'data_10':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDetailsColumns
            firstColumn={data.column1[language]}
            secondColumn={data.column2[language]}
          />
        </ChallengeCard>
      );
      break;
    default:
      content = (
        <ChallengeCard title={data.title}>
          <AppText weight={'400'} size={TextSize.LEVEL_3} text={''} />
          <AppText weight={'400'} size={TextSize.LEVEL_3} text={''} />
        </ChallengeCard>
      );
  }

  return <>{content}</>;
};

export default memo(VocabularyOfFeelContent);
