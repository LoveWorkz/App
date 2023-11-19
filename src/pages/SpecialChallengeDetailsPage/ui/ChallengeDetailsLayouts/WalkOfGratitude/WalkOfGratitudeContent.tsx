import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

import {
  ChallengeCard,
  ChallengeDescription,
  ChallengeIntroCard,
} from '@src/entities/Challenge';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';

interface SelfReflectionContentProps {
  data: any;
}

export const WalkOfGratitudeContent = (props: SelfReflectionContentProps) => {
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
            gradientWordscount={3}
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

    case 'data_3':
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
            isMarginBottom
          />
          <ChallengeDescription
            gradientWordscount={4}
            description={data.description4[language]}
            isMarginBottom
          />
          <ChallengeDescription
            gradientWordscount={2}
            description={data.description5[language]}
            isMarginBottom
          />
        </ChallengeCard>
      );
      break;

    default:
      content = <View />;
  }

  return <>{content}</>;
};

export default memo(WalkOfGratitudeContent);
