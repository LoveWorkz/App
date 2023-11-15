import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {moderateScale} from '@src/shared/lib/Metrics';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {cutText} from '@src/shared/lib/common';
import CustomCheckBox from '@src/shared/ui/CustomCheckBox/CustomCheckBox';
import {isPlatformIos} from '@src/shared/consts/common';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {LockedPopup} from '@src/widgets/LockedPopup';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {useTheme} from '@src/app/providers/themeProvider';
import {SpecialChallengeType} from '../../model/types/ChallengeTypes';
import challengeStore from '../../model/store/challengeStore';
import RoundChallenge from '../RoundChallenge/RoundChallenge';
import {getChallengesLockedPopupContent} from '../../model/lib/challenge';
import {challengeStyles} from './ChallengeItem';

interface SpecialChallengeItemProps {
  challenge: SpecialChallengeType;
  isLoading: boolean;
}

const borderRadius = moderateScale(20);

export const SpecialChallengeItem = (props: SpecialChallengeItemProps) => {
  const {challenge, isLoading} = props;
  const {title, description, isSelected, id, isBlocked, specialChallengeType} =
    challenge;

  const colors = useColors();
  const {t, i18n} = useTranslation();
  const {theme} = useTheme();

  const challengesLockedPopupContent = getChallengesLockedPopupContent(t);

  const [lockedPopupVisible, setLockedPopupVisible] = useState(false);

  const StandardTextLength = 50;
  const language = i18n.language as LanguageValueType;
  const ISDescriptionLarge = description[language].length > StandardTextLength;

  const onChangeHandler = useCallback(() => {
    const newValue = !isSelected;
    challengeStore.selectSpecialChallenge({id, newValue});
  }, [id, isSelected]);

  const onChallengePressHandler = () => {
    if (isBlocked) {
      return;
    }

    challengeStore.setSpecialChallenge(challenge);

    navigation.navigate(AppRouteNames.CHALLENGE_CARDS, {
      title: title[language],
      specialChallengeType: specialChallengeType,
    });
  };

  if (isLoading) {
    return <Skeleton width={'100%'} height={120} borderRadius={borderRadius} />;
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
          <RoundChallenge isLocked={isBlocked} />
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
          disabled={isBlocked}
          style={styles.checkbox}
          checked={isSelected}
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

export default memo(SpecialChallengeItem);

const styles = StyleSheet.create({
  ...challengeStyles,
});
