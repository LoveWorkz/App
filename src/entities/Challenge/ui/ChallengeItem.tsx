import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {cutText} from '@src/shared/lib/common';
import CustomCheckBox from '@src/shared/ui/CustomCheckBox/CustomCheckBox';
import {isPlatformIos} from '@src/shared/consts/common';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {LockedPopup} from '@src/widgets/LockedPopup';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {useTheme} from '@src/app/providers/themeProvider';
import {ChallengeType} from '../model/types/ChallengeTypes';
import challengeStore from '../model/store/challengeStore';
import RoundChallenge from './RoundChallenge/RoundChallenge';
import {getChallengesLockedPopupContent} from '../model/lib/challenge';

export enum ChallengeTheme {
  CORE = 'core',
  SPECIAL = 'special',
}

interface SubChallengeProps {
  challenge: ChallengeType;
  challengeTheme?: ChallengeTheme;
  isLoading: boolean;
}

const borderRadius = moderateScale(20);

export const ChallengeItem = (props: SubChallengeProps) => {
  const {challenge, isLoading, challengeTheme = ChallengeTheme.CORE} = props;
  const {title, description, isChecked, nomer, id} = challenge;
  const colors = useColors();
  const {t, i18n} = useTranslation();
  const {theme} = useTheme();

  const challengesLockedPopupContent = getChallengesLockedPopupContent(t);

  const [visible, setVisible] = useState(false);
  const [lockedPopupVisible, setLockedPopupVisible] = useState(false);

  const StandardTextLength = 50;
  const language = i18n.language as LanguageValueType;
  const ISDescriptionLarge = description[language].length > StandardTextLength;

  const onShowHandler = () => {
    setVisible(true);
  };

  const onHideHandler = () => {
    setVisible(false);
  };

  const onChangeHandler = useCallback(() => {
    challengeStore.selectChallenge({id});
  }, [id]);

  const onChallengePressHandler = () => {
    // setLockedPopupVisible(true);
    navigation.navigate(AppRouteNames.CHALLENGE_CARDS, {
      title: 'TEST',
    });
  };

  if (isLoading) {
    return <Skeleton width={'100%'} height={120} borderRadius={borderRadius} />;
  }

  if (challengeTheme === ChallengeTheme.CORE) {
    return (
      <View
        style={[
          styles.ChallengeItem,
          {
            backgroundColor: colors.bgSecondaryColor,
            ...getShadowOpacity(theme).shadowOpacity_level_1,
          },
        ]}>
        <View style={styles.nomerWrapper}>
          <RoundChallenge number={nomer} isActive={isChecked} />
        </View>
        <View style={styles.textWrapper}>
          <AppText
            style={styles.title}
            weight={'500'}
            size={TextSize.LEVEL_4}
            text={title[language]}
          />
          {visible ? (
            <>
              <AppText
                style={[{color: colors.challengeCategoryNameColor}]}
                size={TextSize.LEVEL_4}
                text={description[language]}
                weight={isPlatformIos ? '400' : '100'}
              />
              <TouchableOpacity onPress={onHideHandler}>
                <GradientText
                  style={styles.showLess}
                  weight={'700'}
                  size={TextSize.LEVEL_4}
                  text={t('show_less')}
                />
              </TouchableOpacity>
            </>
          ) : (
            <Text>
              <AppText
                style={[{color: colors.challengeCategoryNameColor}]}
                size={TextSize.LEVEL_4}
                text={
                  ISDescriptionLarge
                    ? cutText({
                        text: description[language],
                        textSize: StandardTextLength,
                      })
                    : description[language]
                }
                weight={isPlatformIos ? '400' : '100'}
              />
              <TouchableOpacity onPress={onShowHandler}>
                <GradientText
                  style={styles.showMore}
                  weight={'700'}
                  size={TextSize.LEVEL_4}
                  text={`${t('show_more')}...`}
                />
              </TouchableOpacity>
            </Text>
          )}
        </View>
        <View>
          <CustomCheckBox checked={isChecked} onChange={onChangeHandler} />
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={onChallengePressHandler}>
      <View
        style={[
          styles.ChallengeItem,
          {
            backgroundColor: colors.bgSecondaryColor,
            ...getShadowOpacity(theme).shadowOpacity_level_1,
          },
        ]}>
        <View style={styles.nomerWrapper}>
          <RoundChallenge />
        </View>
        <View style={styles.textWrapper}>
          <AppText
            style={styles.title}
            weight={'500'}
            size={TextSize.LEVEL_4}
            text={title[language]}
          />

          <AppText
            style={[{color: colors.challengeCategoryNameColor}]}
            size={TextSize.LEVEL_4}
            text={
              ISDescriptionLarge
                ? cutText({
                    text: description[language],
                    textSize: StandardTextLength,
                  })
                : description[language]
            }
            weight={isPlatformIos ? '400' : '100'}
          />
        </View>
        <CustomCheckBox
          style={styles.checkbox}
          checked={isChecked}
          onChange={onChangeHandler}
        />
        <LockedPopup
          title={challengesLockedPopupContent.title}
          text={challengesLockedPopupContent.text}
          visible={lockedPopupVisible}
          setVisible={setLockedPopupVisible}
        />
      </View>
    </TouchableOpacity>
  );
};

export default memo(ChallengeItem);

const styles = StyleSheet.create({
  ChallengeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(10),
    borderRadius: borderRadius,
  },
  nomerWrapper: {
    alignItems: 'center',
    width: 'auto',
  },
  textWrapper: {
    width: horizontalScale(191),
  },
  title: {
    marginBottom: horizontalScale(10),
  },
  showMore: {
    textDecorationLine: 'underline',
    left: horizontalScale(4),
    top: verticalScale(2),
  },
  showLess: {
    textDecorationLine: 'underline',
  },
  checkbox: {
    padding: moderateScale(5),
    height: horizontalScale(30),
  },
});
