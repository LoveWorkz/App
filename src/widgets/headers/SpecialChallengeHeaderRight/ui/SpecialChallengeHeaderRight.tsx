import React, {memo, useMemo} from 'react';
import {View} from 'react-native';

import InformationBlock from '@src/shared/ui/InformationBlock/InformationBlock';
import {horizontalScale} from '@src/shared/lib/Metrics';
import {
  ChallengeInfoPopup,
  getChallengeInfoPopupContent,
  challengeStore,
} from '@src/entities/Challenge';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {observer} from 'mobx-react-lite';

const SpecialChallengeHeaderRight = () => {
  const specialChallenge = challengeStore.specialChallenge;

  const language = useLanguage();

  const textList = useMemo(() => {
    return getChallengeInfoPopupContent({specialChallenge, language});
  }, [specialChallenge, language]);

  return (
    <View>
      <InformationBlock
        popupWidth={horizontalScale(330)}
        isChallenge
        text={textList}
        Popup={ChallengeInfoPopup}
      />
    </View>
  );
};

export default memo(observer(SpecialChallengeHeaderRight));
