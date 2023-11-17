import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';

import {
  ChallengeCard,
  ChallengeDescription,
  ChallengeDescriptionList,
  ChallengeIntroCard,
} from '@src/entities/Challenge';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';

interface SelfReflectionContentProps {
  data: any;
}

export const SelfReflectionContent = (props: SelfReflectionContentProps) => {
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
            isMarginBottom
          />
          <ChallengeDescription
            gradientWordscount={1}
            description={data.description3[language]}
          />
        </ChallengeCard>
      );
      break;
    case 'data_2':
      const list = [
        {
          description: data.emotional_reflections.situation[language],
        },
        {
          description: data.emotional_reflections.thoughts[language],
        },
        {
          description:
            data.emotional_reflections.emotionsAndSensations[language],
        },
      ];

      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDescription
            description={data.description1[language]}
            isMarginBottom
          />
          <ChallengeDescriptionList list={list} isMarginBottom />
          <ChallengeDescription description={data.description2[language]} />
        </ChallengeCard>
      );
      break;
    case 'data_3':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDescription
            gradientWordscount={1}
            number={1}
            description={data.description1.firstPart[language]}
          />
          <ChallengeDescription
            description={data.description1.secondPart[language]}
            isMarginBottom
          />
          <ChallengeDescription
            gradientWordscount={1}
            number={2}
            description={data.description2.firstPart[language]}
          />
          <ChallengeDescription
            description={`${data.description2.secondPart[language]}.....`}
            isMarginBottom
          />
          <ChallengeDescription
            gradientWordscount={1}
            description={`${data.description2.thirdPart[language]}.....`}
            isMarginBottom
          />
        </ChallengeCard>
      );
      break;
    case 'data_4':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDescription
            gradientWordscount={1}
            number={3}
            description={data.description1.firstPart[language]}
          />
          <AppText
            weight={'500'}
            size={TextSize.LEVEL_3}
            text={data.description1.secondPart[language].join(' \n')}
          />
        </ChallengeCard>
      );
      break;
    case 'data_5':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDescription
            gradientWordscount={1}
            number={4}
            description={data.description1[language]}
            isMarginBottom
          />
          <ChallengeDescription
            gradientWordscount={1}
            number={5}
            description={data.description2[language]}
            isMarginBottom
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

export default memo(SelfReflectionContent);
