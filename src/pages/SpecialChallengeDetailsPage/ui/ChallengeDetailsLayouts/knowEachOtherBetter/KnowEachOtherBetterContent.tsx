import React, {memo} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {
  ChallengeCard,
  ChallengeDescription,
  ChallengeIntroCard,
} from '@src/entities/Challenge';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';

interface KnowEachOtherBetterContentProps {
  data: any;
}

export const KnowEachOtherBetterContent = (
  props: KnowEachOtherBetterContentProps,
) => {
  const {data} = props;

  const {i18n} = useTranslation();
  const language = i18n.language as LanguageValueType;

  let content;

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
            isMarginBottom
          />
          <ChallengeDescription
            description={data.description2[language]}
            isMarginBottom
          />
          <ChallengeDescription description={data.description3[language]} />
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
          <ChallengeDescription
            description={data.description5[language]}
            isMarginBottom
          />
          <ChallengeDescription description={data.description6[language]} />
        </ChallengeCard>
      );
      break;

    case 'data_3':
    case 'data_4':
    case 'data_5':
    case 'data_6':
      content = (
        <ChallengeCard title={data.title[language]}>
          {data.description1[language]
            .split('?')
            .filter((item: string) => item.trim())
            .map((item: string, index: number) => (
              <ChallengeDescription
                key={index.toString()}
                description={`${item.trim()}?`}
              />
            ))}
        </ChallengeCard>
      );
      break;

    default:
      content = <View />;
  }

  return <>{content}</>;
};

export default memo(KnowEachOtherBetterContent);
