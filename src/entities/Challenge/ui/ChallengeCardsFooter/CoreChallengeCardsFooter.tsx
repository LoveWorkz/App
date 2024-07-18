import React, {memo, useCallback, useEffect, useMemo} from 'react';
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

interface CoreChallengeCardsFooterProps {
  count?: number;
  currentIndex?: number;
}

const CoreChallengeCardsFooter = (props: CoreChallengeCardsFooterProps) => {
  const {count, currentIndex} = props;
  const colors = useColors();

  const {isSessionFlow} = challengeStore;
  const currentCoreChallenge = challengeStore.coreChallenge;
  const isSelectingChallenge = challengeStore.isSelectingChallenge;
  const {session} = sessionStore;

  // console.log('currentIndex FOOTIER', currentIndex);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onPressHandler = () => {
    // console.log('ON PRESS HANDLER');
    challengeStore.coreChallengeCardButtonPressHandler({
      coreChallengeId: currentCoreChallenge!.id,
      isChecked: currentCoreChallenge!.isChecked,
    });
  };

  // useEffect(() => {
  //   challengeStore.swipeSpecialChallengeCard(cardId);
  // }, []);

  const showPagination = currentIndex !== undefined && count;

  // console.log('CardsFooter: CORE CHALLENGE', currentCoreChallenge?.id);

  const DoneButton = useMemo(() => {
    return (
      <Button
        theme={ButtonTheme.CLEAR}
        backgroundColor="##8581cf"
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
          text="Done"
          style={{color: colors.white, fontWeight: 600, paddingLeft: 12}}
          size={TextSize.LEVEL_4}
        />
      </Button>
    );
  }, [colors.white]);

  const ProceedButton = useMemo(() => {
    return (
      <View style={styles.footer}>
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
      </View>
    );
  }, [colors.white, isSelectingChallenge, onPressHandler]);

  const RegularFooter = useMemo(() => {
    return (
      <>
        {currentCoreChallenge && (
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
                      text={'Lock one of the challenges'}
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
  }, [
    colors.white,
    count,
    currentCoreChallenge,
    currentIndex,
    isSelectingChallenge,
    onPressHandler,
    session?.isCurrent,
    showPagination,
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
