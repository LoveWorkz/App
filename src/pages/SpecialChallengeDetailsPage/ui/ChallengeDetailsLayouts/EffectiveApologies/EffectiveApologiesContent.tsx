import React, {memo} from 'react';
import {View} from 'react-native';

import {
  ChallengeCard,
  ChallengeDescription,
  ChallengeIntroCard,
} from '@src/entities/Challenge';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {useTranslation} from 'react-i18next';

interface EffectiveApologiesContentProps {
  data: any;
}

export const EffectiveApologiesContent = (
  props: EffectiveApologiesContentProps,
) => {
  const {data} = props;

  const {i18n} = useTranslation();
  const language = i18n.language as LanguageValueType;

  let content;

  switch ('data_1') {
    case 'data_1':
      content = <ChallengeCard title='TITLE'>
        <></>
      </ChallengeCard>;
      break;

    default:
      content = <View />;
  }

  return <>{content}</>;
};

export default memo(EffectiveApologiesContent);
