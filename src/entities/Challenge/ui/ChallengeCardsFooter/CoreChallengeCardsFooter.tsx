import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import Pagination from '@src/shared/ui/HorizontalSlide/Pagination';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {CARD_WIDTH} from '@src/shared/consts/common';
import {sessionStore} from '@src/entities/Session';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
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
  const isSelectingChallenge = challengeStore.isSelectingChallenge;
  const {session} = sessionStore;

  if (!currentCoreChallenge) {
    return null;
  }

  const onPressHandler = () => {
    challengeStore.coreChallengeCardButtonPressHandler({
      coreChallengeId: currentCoreChallenge.id,
      isChecked: currentCoreChallenge.isChecked,
    });
  };

  if (!isSessionFlow) {
    return (
      <View style={styles.footer}>
        <Button
          disabled={isSelectingChallenge}
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
      </View>
    );
  }

  return (
    <View style={styles.footer}>
      {challengeStore.isChallengeLockedIn(currentCoreChallenge.id) ||
      !session?.isCurrent ? (
        <Button
          disabled={isSelectingChallenge}
          onPress={onPressHandler}
          theme={ButtonTheme.OUTLINED}
          style={[styles.btn, {backgroundColor: colors.white}]}>
          <GradientText
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
    bottom: verticalScale(50),
    alignItems: 'center',
  },
  text: {
    textTransform: 'uppercase',
  },
  btn: {
    width: horizontalScale(CARD_WIDTH),
    borderWidth: 0,
  },
});
