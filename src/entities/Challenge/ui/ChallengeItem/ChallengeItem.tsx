import React, {memo, useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import CustomCheckBox from '@src/shared/ui/CustomCheckBox/CustomCheckBox';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {useTheme} from '@src/app/providers/themeProvider';
import {DisplayText} from '@src/shared/types/types';
import {
  ChallengeType,
  SpecialChallengeType,
} from '../../model/types/ChallengeTypes';
import challengeStore from '../../model/store/challengeStore';

interface ChallengeItemProps {
  challenge?: ChallengeType;
  specailChallenge?: SpecialChallengeType;
  text: DisplayText;
  isChecked: boolean;
  id: string;
}

const ChallengeItem = (props: ChallengeItemProps) => {
  const {isChecked, text, id, challenge, specailChallenge} = props;
  const colors = useColors();
  const {i18n} = useTranslation();
  const {theme} = useTheme();
  const isCoreChallenge = challenge;

  const language = i18n.language as LanguageValueType;

  const onChangeHandler = useCallback(() => {
    if (isCoreChallenge) {
      challengeStore.selectChallenge({id, newValue: !isChecked});
    } else {
      challengeStore.selectSpecialChallenge({id, newValue: !isChecked});
    }
  }, [id, isChecked]);

  const onChallengePressHandler = () => {
    if (isCoreChallenge) {
      challengeStore.setCoreChallenge(challenge);
      navigation.navigate(AppRouteNames.CORE_CHALLENGE_CARDS, {
        // title: title[language],
      });
    } else if (specailChallenge) {
      challengeStore.setSpecialChallenge(specailChallenge);
      navigation.navigate(AppRouteNames.SPECIAL_CHALLENGE_CARDS, {
        specialChallengeType: specailChallenge.specialChallengeType,
        // title: title[language],
      });
    }
  };

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
        <CustomCheckBox checked={isChecked} onChange={onChangeHandler} />

        <View style={styles.line} />
        <View style={styles.textWrapper}>
          <AppText
            weight={'500'}
            size={TextSize.LEVEL_4}
            text={text[language]}
            numberOfLines={2}
            ellipsizeMode={'tail'}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ChallengeItem);

const styles = StyleSheet.create({
  ChallengeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(30),
    paddingVertical: verticalScale(25),
    borderRadius: moderateScale(20),
  },
  line: {
    height: '100%',
    borderRightColor: 'silver',
    borderRightWidth: 1,
    marginLeft: horizontalScale(20),
    marginRight: horizontalScale(10),
  },
  textWrapper: {
    maxWidth: '90%',
  },
});
