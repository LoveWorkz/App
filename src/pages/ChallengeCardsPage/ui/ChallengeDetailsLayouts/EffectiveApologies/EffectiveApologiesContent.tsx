import React, {memo} from 'react';
import {View} from 'react-native';

import {ChallengeIntroCard} from '@src/entities/Challenge';

interface EffectiveApologiesContentProps {
  data: any;
}

export const EffectiveApologiesContent = (
  props: EffectiveApologiesContentProps,
) => {
  const {data} = props;

  let content;

  switch (data.type) {
    case 'intro':
      content = (
        <ChallengeIntroCard title={data.title} description={data.description} />
      );
      break;
    default:
      content = <View />;
  }

  return <>{content}</>;
};

export default memo(EffectiveApologiesContent);
