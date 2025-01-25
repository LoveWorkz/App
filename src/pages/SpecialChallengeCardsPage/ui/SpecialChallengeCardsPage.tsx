import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
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
import {useTranslation} from 'react-i18next';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {useTheme} from '@src/app/providers/themeProvider';
import {challengesStore} from '@src/pages/ChallengesPage';
import { CheckIcon } from '@src/shared/assets/icons/Check';
import { SvgXml } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SpecialChallengeCardsPage = () => {
  const language = useLanguage();
  const colors = useColors();
  const {t} = useTranslation();
  const {isDark} = useTheme();

  // const specialChallenge = challengeStore.specialChallenge;
  const specialChallenge = challengesStore.specialChallenges.filter(challenge => challenge.id === challengeStore.specialChallenge?.id).pop();
  const specialChallengeisChecked = specialChallenge?.isChecked;
  const isChallengeDoneButtonVisible =
    challengeStore.isChallengeDoneButtonVisible;
  const isSelectingChallenge = challengeStore.isSelectingChallenge;
  const challengeDoneFromSession = challengeStore.challengeDoneFromSession;
  const {isSessionFlow} = challengeStore;
  // console.log(challengeDoneFromSession, "<--------------------challengeDoneFromSession");
  const isLong = specialChallenge?.long;
  const specialChallengeId = specialChallenge?.id as string;
  const challengeIsActive = challengeStore.challengeIsActive;
  const [showActivateButton, setShowActivateButton] = useState(true);

  useFocusEffect(
    useCallback(() => {
      challengeStore.updateChallengeButtonVisibility();
      challengeStore.updateChallangeDoneFromSession(specialChallenge?.id);
      console.log('You are in special challenge cards page');
      console.log(challengeIsActive, "challengeIsActive");
      console.log(specialChallengeisChecked, "specialChallengeisChecked")

      challengeStore.getActiveSpecialChallangesIds(specialChallenge?.id as string, specialChallengeisChecked as boolean);

      return () => {
        challengeStore.setIsChallengeDoneButtonVisible(false);
        challengeStore.removeChallangeDoneFromSession();
        setShowActivateButton(true);
      };
    }, [])
  );

  const onSwipeHandler = useCallback(({cardId}: {cardId: string}) => {
    challengeStore.swipeSpecialChallengeCard(cardId, language);
  }, []);

  const onSpecialChallengeHandler = () => {
    challengeStore.specialChallengeCardButtonPressHandler(
      specialChallenge?.id as string,
      specialChallenge?.isChecked as boolean,
    );
    if(isLong) {
      challengeStore.setActiveSpecialChallangesIds(specialChallenge.id as string, "remove");
    }
  };

  const undoHandler = () => {
    challengeStore.specialChallengeCardButtonPressHandler(
      specialChallenge?.id as string,
      specialChallenge?.isChecked as boolean,
    );

    if(isLong) {
      challengeStore.setChallengeIsAcitve(false);
    }
  };

  const onActivateButtonPressHandler = () => {
    console.log("Activate special challenge");

    if(isSessionFlow) {
     challengeStore.specialChallengeSessionFlow(isSessionFlow, specialChallenge?.id as string)
    }

    challengeStore.setActiveSpecialChallangesIds(specialChallengeId, 'add');
    !isSessionFlow && setShowActivateButton(false);
  }

  const onInActivateButtonPressHandler = () => {
    console.log("InActivate special challenge");
    challengeStore.setActiveSpecialChallangesIds(specialChallengeId, 'remove');
    setShowActivateButton(true);
  }

  const listWithMetadata = useMemo(() => {
    if (!specialChallenge) {
      return [];
    }

    const {challengeCardsData} = specialChallenge;

    let listWithSpecialChallengeId = challengeCardsData.map(item => ({
      ...item,
      specialChallengeId: specialChallenge.id,
      isSelectingChallenge,
      isChecked: specialChallenge.isChecked,
    }));

    listWithSpecialChallengeId = listWithSpecialChallengeId.filter((item) => (item.visibility.indexOf(language) !== -1));

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

  const showBottomButton = useMemo(
    () => listWithMetadata[0].showButton,
    [listWithMetadata],
  );

  console.log(showBottomButton, "showBottomButton")

  if (!specialChallenge) {
    return null;
  }

  const specialChallengeGroup =
    challengeGroupStore.getSpecialChallengeGroupById(specialChallenge.groupId);

  const DoneButton = useMemo(() => {
    return (
      <Button
        theme={ButtonTheme.CLEAR}
        onPress={() =>
          specialChallenge && undoHandler()
        }
        backgroundColor="##8581cf"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          paddingHorizontal: 20,
          backgroundColor: '#8581cf',
          borderRadius: 10,
          flexDirection: 'row',
          alignSelf: 'flex-start',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
        <SvgXml
          xml={CheckIcon}
          stroke={colors.white}
          style={{width: horizontalScale(16), height: verticalScale(12)}}
        />

        <AppText
          text={t('common.done')}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{color: colors.white, fontWeight: '600', paddingLeft: 12}}
          size={TextSize.LEVEL_4}
        />
      </Button>
    );
  }, [colors.white, specialChallenge, t]);
  
  const ProceedButton = useMemo(() => {
    return (
      <View style={styles.btnWrapper}>
        <Button
          disabled={isSelectingChallenge}
          onPress={onSpecialChallengeHandler}
          theme={isDark ? ButtonTheme.GRADIENT : ButtonTheme.CLEAR}
          style={[styles.btn, isDark ? {} : {backgroundColor: colors.white}]}>
          {isDark ? (
            <AppText
              style={{color: colors.white}}
              weight={'600'}
              size={TextSize.LEVEL_4}
              text={t('common.we_have_done_the_challenge')}
            />
          ) : (
            <GradientText
              size={TextSize.LEVEL_4}
              weight={'600'}
              text={t('common.we_have_done_the_challenge')}
            />
          )}
        </Button>
      </View>
    );
  }, [colors.white, isDark, isSelectingChallenge, onSpecialChallengeHandler, t]);

  const activateButton = useMemo(() => {
    return (
      <View style={styles.btnWrapper}>
        <Button
          onPress={onActivateButtonPressHandler}
          theme={isDark ? ButtonTheme.GRADIENT : ButtonTheme.CLEAR}
          style={[styles.btn, isDark ? {} : {backgroundColor: colors.white}]}>
          {isDark ? (
            <AppText
              style={{color: colors.white}}
              weight={'600'}
              size={TextSize.LEVEL_4}
              text={t('common.activate_button')}
            />
          ) : (
            <GradientText
              size={TextSize.LEVEL_4}
              weight={'600'}
              text={t('common.activate_button')}
            />
          )}
      </Button>
      </View>
    )
  }, [specialChallenge]);

  const inActivateButton = useMemo(() => {
    return (
      <Button
        theme={ButtonTheme.CLEAR}
        onPress={onInActivateButtonPressHandler}
        backgroundColor="##8581cf"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          paddingHorizontal: 20,
          backgroundColor: '#8581cf',
          borderRadius: 10,
          flexDirection: 'row',
          alignSelf: 'flex-start',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
        <SvgXml
          xml={CheckIcon}
          stroke={colors.white}
          style={{width: horizontalScale(16), height: verticalScale(12)}}
        />

        <AppText
          text={t('common.in_activate_button')}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{color: colors.white, fontWeight: '600', paddingLeft: 12}}
          size={TextSize.LEVEL_4}
        />
      </Button>
    )
  }, [specialChallenge]);

  return (
    <View style={styles.ChallengeCardsPage}>
      <StatusBar barStyle={'light-content'} backgroundColor={colors.themeSecondaryBackground} />

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
        Footer={ChallengeCardsFooter}
        showLength={4}
        opacityInterval={0.3}
      />
     <View style={{height: 50}}>
      {/* {inActivateButton} */}
      {showBottomButton && isLong ? challengeIsActive ? null : (showActivateButton ? activateButton : inActivateButton) : null}
      
      {(challengeIsActive || !isLong) && showBottomButton && (
        specialChallengeisChecked ? ( isSessionFlow ? ProceedButton : DoneButton ) : ProceedButton
      )}
     </View>
    </View>
  );
};

export default memo(observer(SpecialChallengeCardsPage));

const styles = StyleSheet.create({
  ChallengeCardsPage: {
    flex: 1,
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
  },
  btnWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  btnHidden: {
    opacity: 0,
  }
});