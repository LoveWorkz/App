import React, {memo} from 'react';
import {View} from 'react-native';

import InformationBlock from '@src/shared/ui/InformationBlock/InformationBlock';
import {horizontalScale} from '@src/shared/lib/Metrics';
import {
  ChallengeInfoPopup,
  challengeInfoPopupList,
} from '@src/entities/Challenge';

const SpecialChallengeHeaderRight = () => {
  return (
    <View>
      <InformationBlock
        popupWidth={horizontalScale(330)}
        isChallenge
        text={challengeInfoPopupList}
        Popup={ChallengeInfoPopup}
      />
    </View>
  );
};

export default memo(SpecialChallengeHeaderRight);
