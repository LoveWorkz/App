import React, {memo} from 'react';
import {View} from 'react-native';

import {
  ChallengeCard,
  ChallengeDescription,
  ChallengeIntroCard,
} from '@src/entities/Challenge';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {useTranslation} from 'react-i18next';

interface RapidCalmingContentProps {
  data: any;
}

export const RapidCalmingContent = (props: RapidCalmingContentProps) => {
  const {data} = props;

  let content;

  const {i18n} = useTranslation();
  const language = i18n.language as LanguageValueType;

  switch (data.type) {
    case 'intro':
      content = (
        <ChallengeIntroCard
          title={data.title}
          description={data.multiDescription.part1[language]}
          description2={data.multiDescription.part2[language]}
          description3={data.multiDescription.part3[language]}
        />
      );
      break;

    case 'data_1':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDescription
            description={data.description1[language]}
            gradientWordscount={2}
            isMarginBottom
          />
          <ChallengeDescription
            description={data.description2[language]}
            gradientWordscount={3}
            isMarginBottom
          />
          <ChallengeDescription
            description={data.description3[language]}
            gradientWordscount={1}
            isMarginBottom
          />
          <ChallengeDescription
            description={data.description4[language]}
            gradientWordscount={1}
            isMarginBottom
          />
          <ChallengeDescription
            description={data.description5[language]}
            gradientWordscount={1}
          />
        </ChallengeCard>
      );
      break;

    case 'data_2':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDescription
            description={data.description1[language]}
            isMarginBottom
          />
          <ChallengeDescription
            description={data.description2[language]}
            isMarginBottom
          />
          <ChallengeDescription
            description={data.description3[language]}
            isMarginBottom
          />
          <ChallengeDescription
            description={data.description4[language]}
            isMarginBottom
          />
          <ChallengeDescription description={data.description5[language]} />
        </ChallengeCard>
      );
      break;

    case 'data_3':
    case 'data_4':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDescription
            description={data.description1[language]}
            gradientWordscount={1}
            isMarginBottom
          />
          <ChallengeDescription
            description={data.description2[language]}
            gradientWordscount={1}
            isMarginBottom
          />
          <ChallengeDescription
            description={data.description3[language]}
            gradientWordscount={1}
            isMarginBottom
          />
          <ChallengeDescription
            description={data.description4[language]}
            gradientWordscount={1}
            isMarginBottom
          />
          <ChallengeDescription
            gradientWordscount={1}
            description={data.description5[language]}
          />
        </ChallengeCard>
      );
      break;

    case 'data_5':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDescription
            description={data.description1[language]}
            gradientWordscount={1}
            isMarginBottom
          />
          <ChallengeDescription
            description={data.description2[language]}
            gradientWordscount={1}
            isMarginBottom
          />
          <ChallengeDescription
            description={data.description3[language]}
            gradientWordscount={1}
          />
        </ChallengeCard>
      );
      break;

    case 'data_6':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDescription
            description={data.description1[language]}
            gradientWordscount={1}
            isMarginBottom
          />
          <ChallengeDescription
            description={data.description2[language]}
            gradientWordscount={1}
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

export default memo(RapidCalmingContent);
