import React, {memo, useCallback, useMemo} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {
  ChallengeCard,
  ChallengeCardsFooter,
  ChallengeCategoryBlock,
  challengeStore,
} from '@src/entities/Challenge';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import {CARD_WIDTH} from '@src/shared/consts/common';
import {challengeGroupStore} from '@src/entities/ChallengeGroup';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {globalPadding, globalStyles} from '@src/app/styles/GlobalStyle';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';

const SpecialChallengeCardsPage = () => {
  const language = useLanguage();
  const colors = useColors();

  const specialChallenge = challengeStore.specialChallenge;

  const isChallengeDoneButtonVisible =
    challengeStore.isChallengeDoneButtonVisible;
  const isSelectingChallenge = challengeStore.isSelectingChallenge;

  useFocusEffect(
    useCallback(() => {
      challengeStore.updateChallengeButtonVisibility();

      return () => {
        challengeStore.setIsChallengeDoneButtonVisible(false);
      };
    }, []),
  );

  const onSwipeHandler = useCallback(({cardId}: {cardId: string}) => {
    challengeStore.swipeSpecialChallengeCard(cardId);
  }, []);

  const onSpecialChallengeHandler = () => {
    challengeStore.specialChallengeCardButtonPressHandler(
      specialChallenge?.id as string,
      specialChallenge?.isChecked as boolean,
    );
  };

  const listWithMetadata = useMemo(() => {
    if (!specialChallenge) {
      return [];
    }

    const {challengeCardsData} = specialChallenge;

    const listWithSpecialChallengeId = challengeCardsData.map(item => ({
      ...item,
      specialChallengeId: specialChallenge.id,
      isSelectingChallenge,
      isChecked: specialChallenge.isChecked,
    }));

    // If the challenge done button is not visible, return the original data.
    if (!isChallengeDoneButtonVisible) {
      return listWithSpecialChallengeId;
    }

    // When the button is visible, add a `showButton: true` property to each item.
    return listWithSpecialChallengeId.map(item => ({
      ...item,
      showButton: true,
    }));
  }, [isChallengeDoneButtonVisible, specialChallenge, isSelectingChallenge]);

  console.log(listWithMetadata[0].showButton);

  const showBottomButton = useMemo(
    () => listWithMetadata[0].showButton,
    [listWithMetadata],
  );

  if (!specialChallenge) {
    return null;
  }

  const specialChallengeGroup =
    challengeGroupStore.getSpecialChallengeGroupById(specialChallenge.groupId);

  return (
    <View style={styles.ChallengeCardsPage}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.topPart}>
        <ChallengeCategoryBlock
          text={
            specialChallengeGroup
              ? specialChallengeGroup.displayName[language]
              : ''
          }
        />
      </View>
      <HorizontalSlide
        onSwipeHandler={onSwipeHandler}
        data={listWithMetadata}
        itemStyle={styles.itemStyle}
        Component={ChallengeCard}
        isSlideEnabled
        itemWidth={CARD_WIDTH}
        Footer={ChallengeCardsFooter}
        showLength={4}
        opacityInterval={0.3}
      />
      {showBottomButton && (
        <View style={styles.btnWrapper}>
          <Button
            disabled={isSelectingChallenge}
            onPress={onSpecialChallengeHandler}
            theme={ButtonTheme.CLEAR}
            style={[styles.btn, {backgroundColor: colors.white}]}>
            <AppText
              style={{color: colors.tabIconColor}}
              size={TextSize.LEVEL_4}
              weight={'600'}
              text={'We’ve done the challenge'}
            />
          </Button>
        </View>
      )}
    </View>
  );
};

export default memo(observer(SpecialChallengeCardsPage));

const styles = StyleSheet.create({
  ChallengeCardsPage: {
    flex: 1,
    marginTop: verticalScale(20),
  },
  topPart: {
    alignItems: 'center',
    top: verticalScale(3),
  },
  itemStyle: {
    marginLeft: -globalPadding,
  },
  btn: {
    width: horizontalScale(CARD_WIDTH),
    borderRadius: 14,
    // borderWidth: 0,
  },
  btnWrapper: {
    // width: horizontalScale(CARD_WIDTH),
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: verticalScale(0),
    alignItems: 'center',
    // borderWidth: 5,
    ...globalStyles.zIndex_1,
  },
});
