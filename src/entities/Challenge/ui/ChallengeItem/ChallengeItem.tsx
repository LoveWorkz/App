import React, {memo, useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import FastImage from 'react-native-fast-image';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import CustomCheckBox from '@src/shared/ui/CustomCheckBox/CustomCheckBox';
import {useTheme} from '@src/app/providers/themeProvider';
import {DisplayText} from '@src/shared/types/types';
import {leaves} from '@src/shared/assets/images';
import {ChallengeHeartIcon} from '@src/shared/assets/icons/ChallengeHeart';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
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
  const language = useLanguage();
  const {theme} = useTheme();
  const isCoreChallenge = challenge;

  const onChangeHandler = useCallback(() => {
    if (isCoreChallenge) {
      challengeStore.selectChallenge({id, newValue: !isChecked});
    } else {
      challengeStore.selectSpecialChallenge({id, newValue: !isChecked});
    }
  }, [id, isChecked]);

  const onChallengePressHandler = () => {
    // setting this flag to avoid going to the final page
    challengeStore.setIsSessionFlow(false);

    if (isCoreChallenge) {
      challengeStore.coreChallengePressHandler({challenge});
    } else if (specailChallenge) {
      challengeStore.specialChallengePressHandler(specailChallenge);
    }
  };

  return (
    <TouchableOpacity onPress={onChallengePressHandler}>
      <View
        style={[
          styles.ChallengeItem,
          {
            ...getShadowOpacity(theme, colors.bgSecondaryColor)
              .shadowOpacity_level_1,
            backgroundColor: colors.bgSecondaryColor,
          },
        ]}>
        <FastImage style={styles.img} resizeMode={'stretch'} source={leaves} />
        <SvgXml
          xml={ChallengeHeartIcon}
          fill={colors.white}
          style={styles.challengeHeartIcon}
        />
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
  img: {
    height: horizontalScale(80),
    width: horizontalScale(80),
    position: 'absolute',
    bottom: 0,
  },
  challengeHeartIcon: {
    height: horizontalScale(20),
    width: horizontalScale(20),
    position: 'absolute',
    top: 10,
    left: horizontalScale(50),
  },
});
