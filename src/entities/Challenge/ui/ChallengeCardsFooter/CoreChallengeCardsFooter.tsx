import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import Pagination from '@src/shared/ui/HorizontalSlide/Pagination';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {CARD_WIDTH} from '@src/shared/consts/common';
import challengeStore from '../../model/store/challengeStore';

interface CoreChallengeCardsFooterProps {
  count: number;
  currentIndex: number;
}

const CoreChallengeCardsFooter = (props: CoreChallengeCardsFooterProps) => {
  const {count, currentIndex} = props;
  const colors = useColors();

  const {isSessionFlow} = challengeStore;
  const currentCoreChallenge = challengeStore.coreChallenge;

  if (!currentCoreChallenge) {
    return null;
  }

  const onPressHandler = () => {
    challengeStore.coreChallengeCardButtonPressHandler(
      currentCoreChallenge.id,
      currentCoreChallenge.isChecked,
    );
  };

  return (
    <View style={styles.footer}>
      {challengeStore.isChallengeLockedIn(currentCoreChallenge.id) ||
      !isSessionFlow ? (
        <Button
          onPress={onPressHandler}
          theme={ButtonTheme.GRADIENT}
          style={styles.btn}>
          <AppText
            style={{color: colors.white}}
            size={TextSize.LEVEL_4}
            weight={'600'}
            text={'We’ve done the challenge'}
          />
        </Button>
      ) : (
        <>
          <Pagination
            isWhite={true}
            currentIndex={currentIndex}
            count={count}
          />
          <AppText
            size={TextSize.LEVEL_2}
            style={[styles.text, {color: colors.white}]}
            align={'center'}
            lineHeight={15}
            weight={'600'}
            text={'Lock one of the challenges'}
          />
        </>
      )}
    </View>
  );
};

export default memo(observer(CoreChallengeCardsFooter));

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: verticalScale(40),
    alignItems: 'center',
  },
  text: {
    textTransform: 'uppercase',
  },
  btn: {
    width: horizontalScale(CARD_WIDTH),
  },
});
