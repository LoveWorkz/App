import React, {memo} from 'react';
import {View} from 'react-native';

import InformationBlock from '@src/shared/ui/InformationBlock/InformationBlock';
import {infoTextType} from '@src/widgets/InformationBlock';
import {horizontalScale} from '@src/shared/lib/Metrics';

const list: infoTextType[] = [
  {
    text: 'Remember, the most beautiful and effective “Thank you” is a sincere one. Personalising these gratitude expressions to align with your unique relationship will make them all the more meaningful.',
  },
  {
    text: 'Expressing gratitude should not be limited to just this challenge but should be integrated as a consistent element in your daily love life.',
  },
];

const SpecialChallengeHeaderRight = () => {
  return (
    <View>
      <InformationBlock
        popupWidth={horizontalScale(320)}
        isChallenge
        text={list}
      />
    </View>
  );
};

export default memo(SpecialChallengeHeaderRight);
