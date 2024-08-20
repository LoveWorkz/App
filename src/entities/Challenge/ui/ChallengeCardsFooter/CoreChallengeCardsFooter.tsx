import React, {memo, useMemo} from 'react';
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
  const currentCoreChallenge = challengeStore.coreChallenge;
  const isSelectingChallenge = challengeStore.isSelectingChallenge;
  const {session} = sessionStore;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onCompleteHandler = () => {
    challengeStore.coreChallengeCardButtonPressHandler({
      coreChallengeId: currentCoreChallenge!.id,
      isChecked: currentCoreChallenge!.isChecked,
    });
  };

  const undoHandler = (challenge: ChallengeType) => {
    challengeStore.coreChallengeCardButtonPressHandler({
      coreChallengeId: challenge.id,
      isChecked: challenge.isChecked,
    });
  };

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
          style={{color: colors.white, fontWeight: 600, paddingLeft: 12}}
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
                    text={t('challenge.hop_to_the_challenge')}
                  />
                ) : (
                  <GradientText
                    size={TextSize.LEVEL_4}
                    weight={'600'}
                    text={t('challenge.hop_to_the_challenge')}
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

  // if (currentCoreChallenge) {
  //   console.log(
  //     'IS SESSION FLOW: ',
  //     `${currentCoreChallenge.id}: `,
  //     isSessionFlow,
  //   );
  //   console.log(
  //     'CHAL IS CHECKED: ',
  //     `${currentCoreChallenge.id}: `,
  //     currentCoreChallenge.isChecked,
  //   ); //TODO: here is the error
  // }

  if (!currentCoreChallenge) {
    return null;
  }

  if (!isSessionFlow && currentCoreChallenge.isChecked) {
    return DoneButton;
  } else if (!isSessionFlow && !currentCoreChallenge.isChecked) {
    return ProceedButton;
  } else {
    return RegularFooter;
  }

  // if (!isSessionFlow) {
  //   if (currentCoreChallenge.isChecked) {
  //     return DoneButton;
  //   } else {
  //     return ProceedButton;
  //   }
  // } else {
  //   // return RegularFooter;
  //   if (currentCoreChallenge.isChecked) {
  //     return DoneButton;
  //   } else {
  //     return RegularFooter;
  //   }
  // }
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
