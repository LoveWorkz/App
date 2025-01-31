import React, {act, memo, useCallback, useEffect, useMemo, useState} from 'react';
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
import {SvgXml} from 'react-native-svg';
import {CheckIcon} from '@src/shared/assets/icons/Check';
import {ChallengeType} from '../../model/types/ChallengeTypes';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@src/app/providers/themeProvider';
import {challengesStore} from '@src/pages/ChallengesPage';
import { useFocusEffect } from '@react-navigation/native';

interface CoreChallengeCardsFooterProps {
  count?: number;
  currentIndex?: number;
}

const CoreChallengeCardsFooter = (props: CoreChallengeCardsFooterProps) => {
  const {count, currentIndex} = props;
  const colors = useColors();
  const {t} = useTranslation();
  const {isDark} = useTheme();

  const {isSessionFlow} = challengeStore;
  const currentCoreChallenge = challengesStore.challenges.filter(challenge => challenge.id === challengeStore.coreChallenge?.id).pop();
  const currentCoreChallengeIsChecked = currentCoreChallenge?.isChecked;
  const isSelectingChallenge = challengeStore.isSelectingChallenge;
  const {session} = sessionStore;
  
  const challengeIsActive = challengeStore.activeChallangesIds.includes(currentCoreChallenge.id);
  const [acceptedChallengeIds, setAcceptedChallengeIds] = useState([]);
  const challengeIsAccept = acceptedChallengeIds.includes(currentCoreChallenge.id);
  const isChallengeLockedIn = challengeStore.isChallengeLockedIn(currentCoreChallenge.id)

  useFocusEffect(
    useCallback(() => {
      challengeStore.getActiveChallengeIds();
    }, [])
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onCompleteHandler = () => {
    challengeStore.coreChallengeCardButtonPressHandler({
      challenge: currentCoreChallenge as ChallengeType,
      coreChallengeId: currentCoreChallenge!.id,
      isChecked: currentCoreChallenge!.isChecked,
    });
    challengeStore.setActiveSpecialChallangesIds(currentCoreChallenge as ChallengeType, "remove");
  };

  const undoHandler = (challenge: ChallengeType) => {
    challengeStore.coreChallengeCardButtonPressHandler({
      challenge: currentCoreChallenge as ChallengeType,
      coreChallengeId: challenge.id,
      isChecked: challenge.isChecked,
    });
    challengeStore.setChallengeIsAcitve(false);
    challengeStore.getActiveChallengeIds();
  };

  const onActivateButtonPressHandler = () => {
    console.log("Activate special challenge");

    challengeStore.coreChallengeSessionFlow(isSessionFlow, currentCoreChallenge?.id as string)

    challengeStore.setActiveSpecialChallangesIds(currentCoreChallenge as ChallengeType, 'add');

    const newAcceptedChallengeIds = [...acceptedChallengeIds];
    newAcceptedChallengeIds.push(currentCoreChallenge.id);
    setAcceptedChallengeIds(newAcceptedChallengeIds);
  }

  const onInActivateButtonPressHandler = () => {
    console.log("InActivate special challenge");
    challengeStore.setActiveSpecialChallangesIds(currentCoreChallenge as ChallengeType, 'remove');
    
    const newAcceptedChallengeIds = [...acceptedChallengeIds].filter(id=>id!==currentCoreChallenge.id);
    setAcceptedChallengeIds(newAcceptedChallengeIds);
  }

  const showPagination = currentIndex !== undefined && count;

  const DoneButton = useMemo(() => {
    return (
      <Button
        theme={ButtonTheme.CLEAR}
        onPress={() =>
          currentCoreChallenge && undoHandler(currentCoreChallenge)
        }
        backgroundColor="##8581cf"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          paddingHorizontal: 20,
          backgroundColor: '#8581cf',
          borderRadius: 10,
          flexDirection: 'row',
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
  }, [colors.white, currentCoreChallenge, t]);

  const ProceedButton = useMemo(() => {
    return (
      <View style={styles.footer}>
        <Button
          disabled={isSelectingChallenge}
          onPress={onCompleteHandler}
          theme={isDark ? ButtonTheme.GRADIENT : ButtonTheme.OUTLINED}
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
  }, [colors.white, isDark, isSelectingChallenge, onCompleteHandler, t]);

  const RegularFooter = useMemo(() => {
    return (
      <>
        {currentCoreChallenge && (
          <View style={styles.footer}>
            {challengeStore.isChallengeLockedIn(currentCoreChallenge.id) ||
            !session?.isCurrent ? (
              <Button
                disabled={isSelectingChallenge}
                onPress={onCompleteHandler}
                theme={isDark ? ButtonTheme.GRADIENT : ButtonTheme.OUTLINED}
                style={[
                  styles.btn,
                  isDark ? {} : {backgroundColor: colors.white},
                ]}>
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
            ) : (
              <>
                {showPagination ? (
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
                      text={t('common.lock_one_of_the_challenges')}
                    />
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </View>
        )}
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    colors.white,
    count,
    currentCoreChallenge,
    currentIndex,
    isSelectingChallenge,
    onCompleteHandler,
    session?.isCurrent,
    showPagination,
    t,
  ]);
  const activateButton = useMemo(() => {
    return (
      <Button
        onPress={onActivateButtonPressHandler}
        theme={isDark ? ButtonTheme.GRADIENT : ButtonTheme.CLEAR}
        style={[styles.btn, isDark ? {} : {backgroundColor: colors.white,  borderRadius: 10}]}>
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
    )
  }, [currentCoreChallenge]);
  
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
  }, [currentCoreChallenge]);

  if (!currentCoreChallenge) {
    return null;
  }


  if(isSessionFlow && !isChallengeLockedIn) return RegularFooter;
  
  if(!challengeIsActive && !challengeIsAccept) {
    return activateButton
  }

  if(!challengeIsActive && challengeIsAccept) {
    return inActivateButton;
  }

  if (!isSessionFlow && currentCoreChallenge.isChecked) {
    return DoneButton;
  } else if (!isSessionFlow && !currentCoreChallenge.isChecked) {
    return ProceedButton;
  } else {
    return RegularFooter;
  }
};

export default memo(observer(CoreChallengeCardsFooter));

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: verticalScale(0),
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