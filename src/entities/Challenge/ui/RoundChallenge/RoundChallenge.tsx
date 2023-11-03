import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import {useTheme} from '@src/app/providers/themeProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {UnlockedRightIcon} from '@src/shared/assets/icons/UnlockedRight';
import {LockedIcon} from '@src/shared/assets/icons/Locked';

interface RoundChallengeProps {
  number?: string;
  isActive?: boolean;
  isLocked?: boolean;
}

const challengeWidth = horizontalScale(60);
const borderRadius = moderateScale(40);

const RoundChallenge = (props: RoundChallengeProps) => {
  const {number, isActive, isLocked = true} = props;
  const colors = useColors();
  const {theme} = useTheme();

  if (number) {
    return (
      <View
        style={[
          styles.RoundChallenge,
          {
            ...getShadowOpacity(theme).shadowOpacity_level_2,
            backgroundColor: colors.bgQuinaryColor,
          },
        ]}>
        <View
          style={[
            styles.content,
            {backgroundColor: colors.bgChallengeContentColor},
          ]}>
          {isActive ? (
            <AppText
              style={[{color: colors.primaryTextColor}]}
              weight={'700'}
              size={TextSize.LEVEL_7}
              text={number}
            />
          ) : (
            <GradientText
              weight={'700'}
              size={TextSize.LEVEL_7}
              text={number}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.RoundChallenge,
        {
          ...getShadowOpacity(theme).shadowOpacity_level_2,
          backgroundColor: colors.bgTertiaryColor,
        },
      ]}>
      <View
        style={[
          styles.content,
          {backgroundColor: colors.bgChallengeContentColor},
        ]}>
        {isLocked ? (
          <SvgXml xml={LockedIcon} style={styles.lockedIcon} />
        ) : (
          <SvgXml xml={UnlockedRightIcon} style={styles.unlockedIcon} />
        )}
      </View>
    </View>
  );
};

export default memo(RoundChallenge);

const styles = StyleSheet.create<Record<string, any>>({
  RoundChallenge: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    height: challengeWidth,
    width: challengeWidth,
    borderRadius: borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    height: horizontalScale(50),
    width: horizontalScale(50),
    borderRadius: borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(3),
    paddingHorizontal: horizontalScale(3),
  },

  unlockedIcon: {
    height: verticalScale(33),
    width: horizontalScale(28),
  },
  lockedIcon: {
    height: verticalScale(30),
    width: horizontalScale(25),
    opacity: 0.7,
  },
});
