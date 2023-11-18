import React, {memo} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {ChallengeIntroCard} from '@src/entities/Challenge';
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

    default:
      content = <View />;
  }

  return <>{content}</>;
};

export default memo(KnowEachOtherBetterContent);
